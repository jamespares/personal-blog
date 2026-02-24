// Seeds comments only for posts that currently have none
const { posts, comments, db: rawDb } = require('./db');
const seedComments = require('./seed-comments-data');

const allPosts = posts.getAllAdmin();
let commentCount = 0;

for (const post of allPosts) {
    const existing = rawDb.prepare('SELECT COUNT(*) as n FROM comments WHERE post_id = ?').get(post.id);
    if (existing.n === 0) {
        const data = seedComments[post.slug];
        if (data) {
            for (const c of data) {
                comments.create({ post_id: post.id, author: c.author, content: c.content });
                commentCount++;
            }
            console.log('Seeded', data.length, 'comments for:', post.slug);
        } else {
            console.log('No comment data for:', post.slug, '(skipping)');
        }
    } else {
        console.log('Skipping (already has comments):', post.slug);
    }
}

console.log('\nDone. Total comments added:', commentCount);
process.exit(0);
