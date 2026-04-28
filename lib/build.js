const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { marked } = require('marked');
const { posts, products } = require('./data');
const { getDict } = require('./i18n');

const DIST_DIR = path.join(__dirname, '../dist');
const VIEWS_DIR = path.join(__dirname, '../views');
const PUBLIC_DIR = path.join(__dirname, '../public');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

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

const globalLocals = {
    isAdmin: false,
    baseUrl: '',
    marked: marked,
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

async function render(templateName, outputPath, data = {}) {
    const templatePath = path.join(VIEWS_DIR, `${templateName}.ejs`);
    const targetPath = path.join(DIST_DIR, outputPath);
    ensureDir(path.dirname(targetPath));
    const html = await ejs.renderFile(templatePath, {
        ...globalLocals,
        ...data
    });
    fs.writeFileSync(targetPath, html);
}

async function buildLang(lang) {
    const dict = getDict(lang);
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const baseUrl = lang === 'en' ? '' : `/${lang}`;
    const topicLabels = dict.topicLabels;
    
    const formatTopic = (topic) => {
        if (!topic) return '';
        return topicLabels[topic.toLowerCase()] || (topic.charAt(0).toUpperCase() + topic.slice(1));
    };

    const langData = {
        currentLang: lang,
        dict,
        baseUrl,
        formatTopic
    };

    // Landing Page
    const recentPosts = posts.getRecent(5, lang);
    const allProducts = products.getAll().filter(p => p.published === 1);
    await render('landing', `${prefix}index.html`, { ...langData, allProducts, recentPosts, showLegal: true });

    // Blog Home
    const blogRecentPosts = posts.getRecent(10, lang);
    const topicPreviews = {
        china: posts.getByTopic('china', lang).slice(0, 3),
        education: posts.getByTopic('education', lang),
        politics: posts.getByTopic('politics', lang).slice(0, 3),
        ai: posts.getByTopic('ai', lang).slice(0, 3),
        books: posts.getByTopic('books', lang).slice(0, 3)
    };
    await render('home', `${prefix}blog/index.html`, { ...langData, recentPosts: blogRecentPosts, topicPreviews });

    // Topics
    const topics = ['china', 'education', 'politics', 'ai', 'books'];
    for (const topic of topics) {
        const topicPosts = posts.getByTopic(topic, lang);
        await render('topic', `${prefix}topic/${topic}/index.html`, { ...langData, topic, posts: topicPosts });
    }

    // Individual Posts
    const allPosts = posts.getAll(lang);
    for (const post of allPosts) {
        await render('post', `${prefix}post/${post.slug}/index.html`, {
            ...langData,
            post: post,
            comments: [],
            pageTitle: post.title,
            metaDescription: post.excerpt || post.content.substring(0, 160)
        });
    }

    // Products Listing
    const activeProducts = products.getActive();
    const comingSoonProducts = products.getComingSoon();
    await render('products', `${prefix}products/index.html`, { ...langData, activeProducts, comingSoonProducts, showLegal: true });

    // Individual Products
    for (const product of allProducts) {
        await render('product', `${prefix}products/${product.slug}/index.html`, {
            ...langData,
            product,
            pageTitle: product.name,
            showLegal: true
        });
    }

    // Legal Pages
    await render('terms', `${prefix}terms/index.html`, { ...langData, pageTitle: dict.termsTitle, metaDescription: `${dict.termsTitle} for all EduConnect Asia Ltd products and services.`, showLegal: true });
    await render('privacy', `${prefix}privacy/index.html`, { ...langData, pageTitle: dict.privacyTitle, metaDescription: `${dict.privacyTitle} for all EduConnect Asia Ltd products and services.`, showLegal: true });
}

async function build() {
    console.log('🚀 Starting static build...');

    // Clean and prepare dist directory
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    ensureDir(DIST_DIR);

    // Copy static assets
    console.log('📦 Copying public assets...');
    copyDir(PUBLIC_DIR, DIST_DIR);

    // Render Pages for each language
    console.log('📄 Rendering pages...');
    for (const lang of ['en', 'fr', 'zh']) {
        console.log(`   Language: ${lang.toUpperCase()}`);
        await buildLang(lang);
    }

    // 404 Page (English only)
    await render('404', '404.html', { currentLang: 'en', dict: getDict('en'), baseUrl: '' });

    console.log('✅ Build complete! Files generated in /dist');
}

build().catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
