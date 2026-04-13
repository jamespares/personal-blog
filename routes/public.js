const express = require('express');
const router = express.Router();
const { marked } = require('marked');
const { posts, comments, products } = require('../db');

// Landing page (Single page scroll)
router.get('/', (req, res) => {
    const activeProducts = products.getActive();
    const recentPosts = posts.getRecent(15);
    res.render('landing', { activeProducts, recentPosts });
});

// Blog home page
router.get('/blog', (req, res) => {
    const recentPosts = posts.getRecent(10);
    const chinaPostsPreview = posts.getByTopic('china').slice(0, 3);
    const educationPostsPreview = posts.getByTopic('education');
    const politicsPostsPreview = posts.getByTopic('politics').slice(0, 3);
    const aiPostsPreview = posts.getByTopic('ai').slice(0, 3);
    const booksPostsPreview = posts.getByTopic('books').slice(0, 3);
    res.render('home', {
        recentPosts,
        topicPreviews: {
            china: chinaPostsPreview,
            education: educationPostsPreview,
            politics: politicsPostsPreview,
            ai: aiPostsPreview,
            books: booksPostsPreview
        }
    });
});

// Topic page
router.get('/topic/:topic', (req, res) => {
    const topic = req.params.topic.toLowerCase();
    if (!['china', 'education', 'politics', 'ai', 'books'].includes(topic)) {
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



// Products listing
router.get('/products', (req, res) => {
    const activeProducts = products.getActive();
    const comingSoonProducts = products.getComingSoon();
    res.render('products', { activeProducts, comingSoonProducts });
});

// Single product
router.get('/products/:slug', (req, res) => {
    const product = products.getBySlug(req.params.slug);
    if (!product) return res.status(404).render('404');
    // Only show unpublished products to admin
    if (!product.published && !req.session.isAdmin) return res.status(404).render('404');
    res.render('product', { product, marked });
});

module.exports = router;
