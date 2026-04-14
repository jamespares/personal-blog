const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// --- Products Data ---
// We treat the existing seed data as our static "database"
const productsData = require('../seed-products-data');

const products = {
    getAll() {
        return productsData;
    },
    getActive() {
        return productsData.filter(p => p.published === 1 && p.status === 'active');
    },
    getComingSoon() {
        return productsData.filter(p => p.published === 1 && p.status === 'coming_soon');
    },
    getBySlug(slug) {
        // Our seed data doesn't have slugs, we generate them from names like our old db helper did
        function generateSlug(title) {
            return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
        }
        return productsData.find(p => generateSlug(p.name) === slug);
    }
};

// --- Posts Data ---
const postsDir = path.join(__dirname, '../content/posts');

const posts = {
    getAll() {
        if (!fs.existsSync(postsDir)) return [];
        const files = fs.readdirSync(postsDir);
        const allPosts = files
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(postsDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const { data, content } = matter(fileContent);
                return {
                    ...data,
                    content,
                    created_at: data.date || new Date().toISOString()
                };
            });
        
        // Sort by date descending
        return allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    getRecent(limit = 15) {
        return this.getAll().slice(0, limit);
    },

    getBySlug(slug) {
        const filePath = path.join(postsDir, `${slug}.md`);
        if (!fs.existsSync(filePath)) return null;
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        return {
            ...data,
            content,
            created_at: data.date || new Date().toISOString()
        };
    },

    getByTopic(topic) {
        return this.getAll().filter(p => p.topic && p.topic.toLowerCase() === topic.toLowerCase());
    }
};

module.exports = { products, posts };
