const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { posts, products } = require('../db');
const { notifySubscribers } = require('../email');

// Auth middleware
function requireAdmin(req, res, next) {
    if (req.session.isAdmin) return next();
    res.redirect('/admin/login');
}

// Login page
router.get('/login', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/admin');
    res.render('admin/login', { error: null });
});

// Login handler
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';

    if (username === adminUser && password === adminPass) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('admin/login', { error: 'Invalid credentials' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Dashboard
router.get('/', requireAdmin, (req, res) => {
    const allPosts = posts.getAllAdmin();
    res.render('admin/dashboard', { posts: allPosts });
});

// New post form
router.get('/new', requireAdmin, (req, res) => {
    res.render('admin/editor', { post: null, error: null });
});

// Create post
router.post('/new', requireAdmin, async (req, res) => {
    const { title, content, excerpt, topic, sources, published } = req.body;
    if (!title || !content || !topic) {
        return res.render('admin/editor', {
            post: req.body,
            error: 'Title, content, and topic are required.'
        });
    }
    const result = posts.create({
        title: title.trim(),
        content,
        excerpt: excerpt ? excerpt.trim() : '',
        topic,
        sources: sources ? sources.trim() : '',
        published: published === 'on'
    });

    // Send email notifications if published
    if (published === 'on') {
        const newPost = posts.getById(result.id);
        try {
            await notifySubscribers(newPost);
        } catch (err) {
            console.error('Email error:', err);
        }
    }

    res.redirect('/admin');
});

// Edit post form
router.get('/edit/:id', requireAdmin, (req, res) => {
    const post = posts.getById(parseInt(req.params.id));
    if (!post) return res.status(404).render('404');
    res.render('admin/editor', { post, error: null });
});

// Update post
router.post('/edit/:id', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, excerpt, topic, sources, published } = req.body;
    if (!title || !content || !topic) {
        return res.render('admin/editor', {
            post: { ...req.body, id },
            error: 'Title, content, and topic are required.'
        });
    }

    const oldPost = posts.getById(id);
    const wasPublished = oldPost && oldPost.published;

    posts.update(id, {
        title: title.trim(),
        content,
        excerpt: excerpt ? excerpt.trim() : '',
        topic,
        sources: sources ? sources.trim() : '',
        published: published === 'on'
    });

    // Notify subscribers if the post is being published for the first time
    if (published === 'on' && !wasPublished) {
        const updatedPost = posts.getById(id);
        try {
            await notifySubscribers(updatedPost);
        } catch (err) {
            console.error('Email error:', err);
        }
    }

    res.redirect('/admin');
});

// Delete post
router.post('/delete/:id', requireAdmin, (req, res) => {
    posts.delete(parseInt(req.params.id));
    res.redirect('/admin');
});

// ── Products ────────────────────────────────────────────────────

// Products dashboard
router.get('/products', requireAdmin, (req, res) => {
    const allProducts = products.getAllAdmin();
    res.render('admin/products-dashboard', { products: allProducts });
});

// New product form
router.get('/products/new', requireAdmin, (req, res) => {
    res.render('admin/product-editor', { product: null, error: null });
});

// Create product
router.post('/products/new', requireAdmin, (req, res) => {
    const { name, tagline, description, features, image_url, live_url, github_url, price, status, published } = req.body;
    if (!name || !description) {
        return res.render('admin/product-editor', {
            product: req.body,
            error: 'Name and description are required.'
        });
    }
    products.create({
        name: name.trim(),
        tagline: tagline ? tagline.trim() : '',
        description,
        features: features ? features.trim() : '',
        image_url: image_url ? image_url.trim() : '',
        live_url: live_url ? live_url.trim() : '',
        github_url: github_url ? github_url.trim() : '',
        price: price ? price.trim() : 'Free',
        status: status || 'active',
        published: published === 'on'
    });
    res.redirect('/admin/products');
});

// Edit product form
router.get('/products/edit/:id', requireAdmin, (req, res) => {
    const product = products.getById(parseInt(req.params.id));
    if (!product) return res.status(404).render('404');
    res.render('admin/product-editor', { product, error: null });
});

// Update product
router.post('/products/edit/:id', requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const { name, tagline, description, features, image_url, live_url, github_url, price, status, published } = req.body;
    if (!name || !description) {
        return res.render('admin/product-editor', {
            product: { ...req.body, id },
            error: 'Name and description are required.'
        });
    }
    products.update(id, {
        name: name.trim(),
        tagline: tagline ? tagline.trim() : '',
        description,
        features: features ? features.trim() : '',
        image_url: image_url ? image_url.trim() : '',
        live_url: live_url ? live_url.trim() : '',
        github_url: github_url ? github_url.trim() : '',
        price: price ? price.trim() : 'Free',
        status: status || 'active',
        published: published === 'on'
    });
    res.redirect('/admin/products');
});

// Delete product
router.post('/products/delete/:id', requireAdmin, (req, res) => {
    products.delete(parseInt(req.params.id));
    res.redirect('/admin/products');
});

module.exports = router;
