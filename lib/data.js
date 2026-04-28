const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// --- Products Data ---
// We treat the existing seed data as our static "database"
const productsData = require('../seed-products-data');

const PRODUCT_CATEGORIES = ['Learn French', 'Learn Chinese', 'Learn English', 'Teaching Tools'];

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function attachSlug(product) {
    return { ...product, slug: generateSlug(product.name) };
}

const products = {
    getAll() {
        return productsData.map(attachSlug);
    },
    getActive() {
        return productsData
            .filter(p => p.published === 1 && p.status === 'active')
            .map(attachSlug);
    },
    getComingSoon() {
        return productsData
            .filter(p => p.published === 1 && p.status === 'coming_soon')
            .map(attachSlug);
    },
    getBySlug(slug) {
        return productsData.find(p => generateSlug(p.name) === slug);
    },
    getByCategory(category) {
        return productsData
            .filter(p => p.published === 1 && p.status === 'active' && p.category === category)
            .map(attachSlug);
    },
    getCategories() {
        return PRODUCT_CATEGORIES;
    }
};

// --- Posts Data ---
const postsDir = path.join(__dirname, '../content/posts');

const posts = {
    getAll(lang = 'en') {
        if (!fs.existsSync(postsDir)) return [];
        const files = fs.readdirSync(postsDir);
        // Load English posts as base
        const enPosts = files
            .filter(file => file.endsWith('.md') && !file.match(/\.(fr|zh)\.md$/))
            .map(file => {
                const slug = file.replace(/\.md$/, '');
                const filePath = path.join(postsDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const { data, content } = matter(fileContent);
                return {
                    ...data,
                    slug,
                    content,
                    created_at: data.date || new Date().toISOString()
                };
            });
        
        if (lang === 'en') {
            return enPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        
        // For fr/zh: load translated versions where available, fallback to English
        const ext = `.${lang}.md`;
        const translatedSlugs = new Set();
        const translatedPosts = files
            .filter(file => file.endsWith(ext))
            .map(file => {
                const slug = file.replace(ext, '');
                translatedSlugs.add(slug);
                const filePath = path.join(postsDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const { data, content } = matter(fileContent);
                return {
                    ...data,
                    slug,
                    content,
                    created_at: data.date || new Date().toISOString()
                };
            });
        
        // Add English fallback posts for those without translation
        const fallbackPosts = enPosts
            .filter(p => !translatedSlugs.has(p.slug))
            .map(p => ({ ...p, _fallback: true }));
        
        const allPosts = [...translatedPosts, ...fallbackPosts];
        return allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    getRecent(limit = 15, lang = 'en') {
        return this.getAll(lang).slice(0, limit);
    },

    getBySlug(slug, lang = 'en') {
        const ext = lang === 'en' ? '.md' : `.${lang}.md`;
        const filePath = path.join(postsDir, `${slug}${ext}`);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContent);
            return {
                ...data,
                slug,
                content,
                created_at: data.date || new Date().toISOString()
            };
        }
        // Fallback to English
        if (lang !== 'en') {
            const enPath = path.join(postsDir, `${slug}.md`);
            if (fs.existsSync(enPath)) {
                const fileContent = fs.readFileSync(enPath, 'utf8');
                const { data, content } = matter(fileContent);
                return {
                    ...data,
                    slug,
                    content,
                    created_at: data.date || new Date().toISOString(),
                    _fallback: true
                };
            }
        }
        return null;
    },

    getByTopic(topic, lang = 'en') {
        return this.getAll(lang).filter(p => p.topic && p.topic.toLowerCase() === topic.toLowerCase());
    }
};

module.exports = { products, posts };
