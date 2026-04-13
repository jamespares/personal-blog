const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');


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
    topic TEXT NOT NULL CHECK(topic IN ('china', 'education', 'politics', 'ai', 'books')),
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



  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    features TEXT,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    price TEXT DEFAULT 'Free',
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'archived', 'coming_soon')),
    published INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// Simple migration: add sources column if it doesn't exist
try {
    db.exec(`ALTER TABLE posts ADD COLUMN sources TEXT;`);
} catch (e) {
    // Column likely already exists
}



// Migration: update CHECK constraint to include 'ai' topic if missing
try {
    const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='posts'").get();
    if (tableInfo && tableInfo.sql && !tableInfo.sql.includes("'ai'")) {
        db.exec(`
            BEGIN;
            ALTER TABLE posts RENAME TO posts_old;
            CREATE TABLE posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                topic TEXT NOT NULL CHECK(topic IN ('china', 'education', 'politics', 'ai', 'books')),
                sources TEXT,
                published INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            );
            INSERT INTO posts (id, title, slug, content, excerpt, topic, sources, published, created_at, updated_at)
                SELECT id, title, slug, content, excerpt, topic, sources, published, created_at, updated_at FROM posts_old;
            DROP TABLE posts_old;
            COMMIT;
        `);
    }
} catch (e) {
    console.error('Migration (add ai topic) failed:', e.message);
}

// Migration: update CHECK constraint to include 'books' topic if missing
try {
    const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='posts'").get();
    if (tableInfo && tableInfo.sql && !tableInfo.sql.includes("'books'")) {
        db.exec(`
            BEGIN;
            ALTER TABLE posts RENAME TO posts_old;
            CREATE TABLE posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                topic TEXT NOT NULL CHECK(topic IN ('china', 'education', 'politics', 'ai', 'books')),
                sources TEXT,
                published INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            );
            INSERT INTO posts (id, title, slug, content, excerpt, topic, sources, published, created_at, updated_at)
                SELECT id, title, slug, content, excerpt, topic, sources, published, created_at, updated_at FROM posts_old;
            DROP TABLE posts_old;
            COMMIT;
        `);
    }
} catch (e) {
    console.error('Migration (add books topic) failed:', e.message);
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



// ── Products ────────────────────────────────────────────────────
const products = {
    getAll() {
        return db.prepare('SELECT * FROM products WHERE published = 1 ORDER BY created_at DESC').all();
    },
    getAllAdmin() {
        return db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    },
    getBySlug(slug) {
        return db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
    },
    getById(id) {
        return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    },
    getActive() {
        return db.prepare("SELECT * FROM products WHERE published = 1 AND status = 'active' ORDER BY created_at DESC").all();
    },
    getComingSoon() {
        return db.prepare("SELECT * FROM products WHERE published = 1 AND status = 'coming_soon' ORDER BY created_at DESC").all();
    },
    create({ name, tagline, description, features, image_url, live_url, github_url, price, status, published }) {
        const slug = generateSlug(name);
        const stmt = db.prepare(
            'INSERT INTO products (name, slug, tagline, description, features, image_url, live_url, github_url, price, status, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        const result = stmt.run(name, slug, tagline || '', description, features || '', image_url || '', live_url || '', github_url || '', price || 'Free', status || 'active', published ? 1 : 0);
        return { id: result.lastInsertRowid, slug };
    },
    update(id, { name, tagline, description, features, image_url, live_url, github_url, price, status, published }) {
        const slug = generateSlug(name);
        db.prepare(
            "UPDATE products SET name=?, slug=?, tagline=?, description=?, features=?, image_url=?, live_url=?, github_url=?, price=?, status=?, published=?, updated_at=datetime('now') WHERE id=?"
        ).run(name, slug, tagline || '', description, features || '', image_url || '', live_url || '', github_url || '', price || 'Free', status || 'active', published ? 1 : 0, id);
        return slug;
    },
    delete(id) {
        db.prepare('DELETE FROM products WHERE id = ?').run(id);
    }
};

module.exports = { db, posts, comments, products };
