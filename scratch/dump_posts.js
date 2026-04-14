const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('database.db');
const posts = db.prepare('SELECT * FROM posts').all();

const outputDir = path.join(__dirname, 'content/posts');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

posts.forEach(post => {
    const filename = `${post.slug}.md`;
    const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
date: ${post.created_at}
topic: ${post.topic}
slug: ${post.slug}
---

${post.content}`;
    
    fs.writeFileSync(path.join(outputDir, filename), frontmatter);
    console.log(`Exported: ${filename}`);
});

console.log('All posts exported successfully.');
