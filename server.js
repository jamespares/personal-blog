require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { posts, comments } = require('./db');

// Auto-seed: insert any posts from seed data that don't already exist
try {
    const seedPosts = require('./seed-posts-data');
    const { db: rawDb } = require('./db');
    let seeded = 0;
    for (const post of seedPosts) {
        const exists = rawDb.prepare('SELECT id FROM posts WHERE title = ?').get(post.title);
        if (!exists) {
            posts.create(post);
            seeded++;
            console.log('✓ Seeded: ' + post.title);
        }
    }
    if (seeded > 0) console.log('Seeded ' + seeded + ' new blog posts.');
} catch (e) {
    console.log('No seed data found or seeding failed:', e.message);
}

// Always seed comments for any post that currently has none
try {
    const { db: rawDb } = require('./db');
    const seedComments = require('./seed-comments-data');
    const allPosts = posts.getAllAdmin();
    let commentCount = 0;
    for (const post of allPosts) {
        const existing = rawDb.prepare('SELECT COUNT(*) as n FROM comments WHERE post_id = ?').get(post.id);
        if (existing.n === 0 && seedComments[post.slug]) {
            for (const c of seedComments[post.slug]) {
                comments.create({ post_id: post.id, author: c.author, content: c.content });
                commentCount++;
            }
        }
    }
    if (commentCount > 0) console.log('Seeded ' + commentCount + ' missing comments.');
} catch (ce) {
    console.log('Comment seeding skipped:', ce.message);
}
const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Make session data available in all templates
app.use((req, res, next) => {
    res.locals.isAdmin = !!req.session.isAdmin;
    res.locals.currentPath = req.path;
    res.locals.baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    res.locals.formatTopic = (topic) => {
        if (!topic) return '';
        const labels = {
            education: 'Education',
            ai: 'AI',
            china: 'China',
            politics: 'Politics'
        };
        return labels[topic.toLowerCase()] || (topic.charAt(0).toUpperCase() + topic.slice(1));
    };
    next();
});

// Routes
app.use('/', require('./routes/public'));
app.use('/admin', require('./routes/admin'));

// 404
app.use((req, res) => {
    res.status(404).render('404');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong.' });
});

app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
});
