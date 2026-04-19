const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { marked } = require('marked');
const { posts, products } = require('./data');

const DIST_DIR = path.join(__dirname, '../dist');
const VIEWS_DIR = path.join(__dirname, '../views');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Helper to ensure directory exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Helper to copy directory recursively
function copyDir(src, dest) {
    ensureDir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Global locals for EJS (replicating Express res.locals)
const globalLocals = {
    isAdmin: false,
    baseUrl: '', // Use relative paths for static hosting
    marked: marked, // Provide marked to all templates
    formatTopic: (topic) => {
        if (!topic) return '';
        const labels = {
            education: 'Education',
            ai: 'AI',
            china: 'China',
            politics: 'Politics',
            books: 'Book Reviews'
        };
        return labels[topic.toLowerCase()] || (topic.charAt(0).toUpperCase() + topic.slice(1));
    }
};

async function build() {
    console.log('🚀 Starting static build...');

    // 1. Clean and prepare dist directory
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    ensureDir(DIST_DIR);

    // 2. Copy static assets
    console.log('📦 Copying public assets...');
    copyDir(PUBLIC_DIR, DIST_DIR);

    // 3. Helper to render and save
    async function render(templateName, outputPath, data = {}) {
        const templatePath = path.join(VIEWS_DIR, `${templateName}.ejs`);
        const targetPath = path.join(DIST_DIR, outputPath);
        ensureDir(path.dirname(targetPath));

        const html = await ejs.renderFile(templatePath, {
            ...globalLocals,
            ...data,
            currentPath: outputPath.replace('index.html', '')
        });

        // Fix internal links for static hosting (Cloudflare clean URLs)
        // Ensure /post/slug links work by making them relative if needed, 
        // or just rely on Cloudflare handling /post/slug/ index files.
        fs.writeFileSync(targetPath, html);
    }

    // 4. Render Pages
    console.log('📄 Rendering pages...');

    // Landing Page (Home)
    const recentPosts = posts.getRecent(15);
    const productCategories = products.getCategories().map(category => ({
        name: category,
        products: products.getByCategory(category)
    })).filter(cat => cat.products.length > 0);
    await render('landing', 'index.html', { productCategories, recentPosts });

    // Blog Home
    const blogRecentPosts = posts.getRecent(10);
    const topicPreviews = {
        china: posts.getByTopic('china').slice(0, 3),
        education: posts.getByTopic('education'),
        politics: posts.getByTopic('politics').slice(0, 3),
        ai: posts.getByTopic('ai').slice(0, 3),
        books: posts.getByTopic('books').slice(0, 3)
    };
    await render('home', 'blog/index.html', { recentPosts: blogRecentPosts, topicPreviews });

    // Topics
    const topics = ['china', 'education', 'politics', 'ai', 'books'];
    for (const topic of topics) {
        console.log(`   - Topic: ${topic}`);
        const topicPosts = posts.getByTopic(topic);
        await render('topic', `topic/${topic}/index.html`, { topic, posts: topicPosts });
    }

    // Individual Posts
    const allPosts = posts.getAll();
    for (const post of allPosts) {
        console.log(`   - Post: ${post.slug}`);
        await render('post', `post/${post.slug}/index.html`, { 
            post: post, 
            comments: [],
            pageTitle: post.title,
            metaDescription: post.excerpt || post.content.substring(0, 160)
        });
    }

    // Products Listing
    const activeProducts = products.getActive();
    const comingSoonProducts = products.getComingSoon();
    await render('products', 'products/index.html', { activeProducts, comingSoonProducts });

    // Individual Products
    const allProducts = products.getAll();
    for (const product of allProducts) {
        console.log(`   - Product: ${product.name}`);
        await render('product', `products/${product.slug}/index.html`, { 
            product, 
            pageTitle: product.name
        });
    }

    // 404 Page
    await render('404', '404.html');

    console.log('✅ Build complete! Files generated in /dist');
}

build().catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
