const express = require('express');
const router = express.Router();
const { marked } = require('marked');
const { posts, comments, subscribers } = require('../db');
const { sendWelcomeEmail } = require('../email');

// Home page
router.get('/', (req, res) => {
    const recentPosts = posts.getRecent(10);
    const chinaPostsPreview = posts.getByTopic('china').slice(0, 3);
    const educationPostsPreview = posts.getByTopic('education').slice(0, 3);
    const politicsPostsPreview = posts.getByTopic('politics').slice(0, 3);
    res.render('home', {
        recentPosts,
        topicPreviews: {
            china: chinaPostsPreview,
            education: educationPostsPreview,
            politics: politicsPostsPreview
        }
    });
});

// Topic page
router.get('/topic/:topic', (req, res) => {
    const topic = req.params.topic.toLowerCase();
    if (!['china', 'education', 'politics'].includes(topic)) {
        return res.status(404).render('404');
    }
    const topicPosts = posts.getByTopic(topic);
    res.render('topic', { topic, posts: topicPosts });
});

// Single post
router.get('/post/:slug', (req, res) => {
    const post = posts.getBySlug(req.params.slug);
    if (!post) return res.status(404).render('404');
    // Only show unpublished posts to admin
    if (!post.published && !req.session.isAdmin) return res.status(404).render('404');
    const postComments = comments.getByPostId(post.id);
    res.render('post', { post, comments: postComments, marked });
});

// Search
router.get('/search', (req, res) => {
    const query = req.query.q || '';
    const results = query ? posts.search(query) : [];
    res.render('search', { query, results });
});

// Add comment
router.post('/post/:slug/comment', (req, res) => {
    const post = posts.getBySlug(req.params.slug);
    if (!post) return res.status(404).render('404');
    const { author, content } = req.body;
    if (author && content) {
        comments.create({ post_id: post.id, author: author.trim(), content: content.trim() });
    }
    res.redirect(`/post/${post.slug}#comments`);
});

// Subscribe
// Step 1: Show topic picker after email entry
router.post('/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return res.redirect('/?subscribe=invalid');
    }
    // Check if already subscribed before showing picker
    const existing = subscribers.getAll().find(s => s.email === email.trim().toLowerCase());
    if (existing) {
        return res.redirect('/?subscribe=exists');
    }
    res.render('subscribe-topics', { email: email.trim().toLowerCase() });
});

// Step 2: Confirm subscription with topic preferences
router.post('/subscribe/confirm', (req, res) => {
    const { email, topics } = req.body;
    if (!email || !email.includes('@')) {
        return res.redirect('/?subscribe=invalid');
    }
    // Build topics string: if 'all' is selected or nothing selected, default to 'all'
    let topicStr = 'all';
    if (topics && topics !== 'all') {
        const selected = Array.isArray(topics) ? topics : [topics];
        topicStr = selected.join(',');
    }
    const result = subscribers.add(email.trim().toLowerCase(), topicStr);
    if (result.success) {
        sendWelcomeEmail(email.trim().toLowerCase(), result.token, topicStr)
            .catch(err => console.error('Welcome email error:', err));
        res.render('subscribe-success', { email, topics: topicStr });
    } else {
        res.redirect('/?subscribe=exists');
    }
});

// Unsubscribe
router.get('/unsubscribe', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).render('error', { message: 'Invalid unsubscribe link.' });
    const removed = subscribers.removeByToken(token);
    res.render('unsubscribe', { success: removed });
});

module.exports = router;
