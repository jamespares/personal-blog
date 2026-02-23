const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dataDir = process.env.DATA_DIR || __dirname;
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'database.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    topic TEXT NOT NULL CHECK(topic IN ('china', 'education', 'politics', 'ai')),
    sources TEXT,
    published INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    topics TEXT NOT NULL DEFAULT 'all',
    unsubscribe_token TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Simple migration: add sources column if it doesn't exist
try {
    db.exec(`ALTER TABLE posts ADD COLUMN sources TEXT;`);
} catch (e) {
    // Column likely already exists
}

// Migration: add topics column to subscribers if it doesn't exist
try {
    db.exec(`ALTER TABLE subscribers ADD COLUMN topics TEXT NOT NULL DEFAULT 'all';`);
} catch (e) {
    // Column likely already exists
}

// Helper: generate a URL-friendly slug
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 80);
}

// Ensure slug uniqueness
function uniqueSlug(title, excludeId = null) {
    let slug = generateSlug(title);
    let candidate = slug;
    let counter = 1;
    while (true) {
        const existing = excludeId
            ? db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(candidate, excludeId)
            : db.prepare('SELECT id FROM posts WHERE slug = ?').get(candidate);
        if (!existing) return candidate;
        candidate = `${slug}-${counter++}`;
    }
}

// ── Posts ────────────────────────────────────────────────────────
const posts = {
    getAll() {
        return db.prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC').all();
    },
    getAllAdmin() {
        return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    },
    getByTopic(topic) {
        return db.prepare('SELECT * FROM posts WHERE topic = ? AND published = 1 ORDER BY created_at DESC').all(topic);
    },
    getBySlug(slug) {
        return db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);
    },
    getById(id) {
        return db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    },
    search(query) {
        const q = `%${query}%`;
        return db.prepare(
            'SELECT * FROM posts WHERE published = 1 AND (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC'
        ).all(q, q);
    },
    create({ title, content, excerpt, topic, sources, published }) {
        const slug = uniqueSlug(title);
        const stmt = db.prepare(
            'INSERT INTO posts (title, slug, content, excerpt, topic, sources, published) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        const result = stmt.run(title, slug, content, excerpt || '', topic, sources || '', published ? 1 : 0);
        return { id: result.lastInsertRowid, slug };
    },
    update(id, { title, content, excerpt, topic, sources, published }) {
        const slug = uniqueSlug(title, id);
        db.prepare(
            "UPDATE posts SET title=?, slug=?, content=?, excerpt=?, topic=?, sources=?, published=?, updated_at=datetime('now') WHERE id=?"
        ).run(title, slug, content, excerpt || '', topic, sources || '', published ? 1 : 0, id);
        return slug;
    },
    delete(id) {
        db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    },
    getRecent(limit = 5) {
        return db.prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT ?').all(limit);
    }
};

// ── Comments ────────────────────────────────────────────────────
const comments = {
    getByPostId(postId) {
        return db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC').all(postId);
    },
    create({ post_id, author, content }) {
        db.prepare('INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)').run(post_id, author, content);
    }
};

// ── Subscribers ─────────────────────────────────────────────────
const subscribers = {
    getAll() {
        return db.prepare('SELECT * FROM subscribers').all();
    },
    add(email, topics = 'all') {
        const token = uuidv4();
        try {
            db.prepare('INSERT INTO subscribers (email, topics, unsubscribe_token) VALUES (?, ?, ?)').run(email, topics, token);
            return { success: true, token };
        } catch (e) {
            if (e.message.includes('UNIQUE')) return { success: false, reason: 'already_subscribed' };
            throw e;
        }
    },
    getByTopics(topic) {
        // Returns subscribers who want 'all' topics OR whose topics list includes the given topic
        return db.prepare(
            "SELECT * FROM subscribers WHERE topics = 'all' OR (',' || topics || ',') LIKE '%,' || ? || ',%'"
        ).all(topic);
    },
    removeByToken(token) {
        const result = db.prepare('DELETE FROM subscribers WHERE unsubscribe_token = ?').run(token);
        return result.changes > 0;
    }
};

module.exports = { db, posts, comments, subscribers };
