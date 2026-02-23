const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { posts } = require('../db');
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

module.exports = router;
