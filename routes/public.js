const express = require('express');
const router = express.Router();
const { marked } = require('marked');
const { posts, products } = require('../lib/data');

// Landing page (Single page scroll)
router.get('/', (req, res) => {
    const activeProducts = products.getActive();
    const recentPosts = posts.getRecent(15);
    res.render('landing', { activeProducts, recentPosts });
});

// Blog home page
router.get('/blog', (req, res) => {
    const recentPosts = posts.getRecent(10);
    const topicPreviews = {
        china: posts.getByTopic('china').slice(0, 3),
        education: posts.getByTopic('education'),
        politics: posts.getByTopic('politics').slice(0, 3),
        ai: posts.getByTopic('ai').slice(0, 3),
        books: posts.getByTopic('books').slice(0, 3)
    };
    res.render('home', { recentPosts, topicPreviews });
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
    
    // Convert markdown content to HTML
    const htmlContent = marked(post.content);
    res.render('post', { post: { ...post, content: htmlContent }, comments: [] });
});

// Search
router.get('/search', (req, res) => {
    const query = req.query.q || '';
    const results = query ? posts.search(query) : [];
    res.render('search', { query, results });
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
    res.render('product', { product, marked });
});

module.exports = router;
