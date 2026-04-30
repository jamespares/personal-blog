/** @jsxImportSource hono/jsx */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

// @ts-ignore — CJS modules imported via tsx
import { posts, products } from "./data.js";
// @ts-ignore
import { getDict } from "./i18n.js";

import { Landing } from "../src/components/pages/Landing";
import { Home } from "../src/components/pages/Home";
import { Post } from "../src/components/pages/Post";
import { Topic } from "../src/components/pages/Topic";
import { Products } from "../src/components/pages/Products";
import { Product } from "../src/components/pages/Product";
import { Terms } from "../src/components/pages/Terms";
import { Privacy } from "../src/components/pages/Privacy";
import { NotFound } from "../src/components/pages/NotFound";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "../dist");
const PUBLIC_DIR = path.join(__dirname, "../public");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src: string, dest: string) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Hono JSX nodes stringify when coerced to string via JSXNode.toString()
// or when used in template literals. We use a small helper.
function renderJSX(node: any): string {
  return String(node);
}

function writeHTML(outputPath: string, node: any) {
  const targetPath = path.join(DIST_DIR, outputPath);
  ensureDir(path.dirname(targetPath));
  const html = "<!DOCTYPE html>\n" + renderJSX(node);
  fs.writeFileSync(targetPath, html);
}

async function buildLang(lang: string) {
  const dict = getDict(lang);
  const prefix = lang === "en" ? "" : `${lang}/`;
  const baseUrl = lang === "en" ? "" : `/${lang}`;

  const formatTopic = (topic: string) => {
    if (!topic) return "";
    return (
      dict.topicLabels[topic.toLowerCase()] ||
      topic.charAt(0).toUpperCase() + topic.slice(1)
    );
  };

  // Landing Page
  const recentPosts = posts.getRecent(5, lang);
  const allProducts = products.getAll().filter((p: any) => p.published === 1);
  writeHTML(
    `${prefix}index.html`,
    <Landing
      currentLang={lang}
      baseUrl={baseUrl}
      dict={dict}
      allProducts={allProducts}
      recentPosts={recentPosts}
      formatTopic={formatTopic}
    />
  );

  // Blog Home
  const blogRecentPosts = posts.getRecent(10, lang);
  const topicPreviews = {
    china: posts.getByTopic("china", lang).slice(0, 3),
    education: posts.getByTopic("education", lang),
    politics: posts.getByTopic("politics", lang).slice(0, 3),
    ai: posts.getByTopic("ai", lang).slice(0, 3),
    books: posts.getByTopic("books", lang).slice(0, 3),
  };
  writeHTML(
    `${prefix}blog/index.html`,
    <Home
      currentLang={lang}
      baseUrl={baseUrl}
      dict={dict}
      recentPosts={blogRecentPosts}
      topicPreviews={topicPreviews}
      formatTopic={formatTopic}
    />
  );

  // Topics
  const topics = ["china", "education", "politics", "ai", "books"];
  for (const topic of topics) {
    const topicPosts = posts.getByTopic(topic, lang);
    writeHTML(
      `${prefix}topic/${topic}/index.html`,
      <Topic
        currentLang={lang}
        baseUrl={baseUrl}
        dict={dict}
        topic={topic}
        posts={topicPosts}
        formatTopic={formatTopic}
      />
    );
  }

  // Individual Posts
  const allPosts = posts.getAll(lang);
  for (const post of allPosts) {
    writeHTML(
      `${prefix}post/${post.slug}/index.html`,
      <Post
        currentLang={lang}
        baseUrl={baseUrl}
        dict={dict}
        post={post}
        formatTopic={formatTopic}
        marked={marked}
      />
    );
  }

  // Products Listing
  const activeProducts = products.getActive();
  const comingSoonProducts = products.getComingSoon();
  writeHTML(
    `${prefix}products/index.html`,
    <Products
      currentLang={lang}
      baseUrl={baseUrl}
      dict={dict}
      activeProducts={activeProducts}
      comingSoonProducts={comingSoonProducts}
    />
  );

  // Individual Products
  for (const product of allProducts) {
    writeHTML(
      `${prefix}products/${product.slug}/index.html`,
      <Product
        currentLang={lang}
        baseUrl={baseUrl}
        dict={dict}
        product={product}
        marked={marked}
      />
    );
  }

  // Legal Pages
  writeHTML(
    `${prefix}terms/index.html`,
    <Terms currentLang={lang} baseUrl={baseUrl} dict={dict} />
  );
  writeHTML(
    `${prefix}privacy/index.html`,
    <Privacy currentLang={lang} baseUrl={baseUrl} dict={dict} />
  );
}

async function build() {
  console.log("🚀 Starting static build (Hono JSX)...");

  // Clean and prepare dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  ensureDir(DIST_DIR);

  // Copy static assets
  console.log("📦 Copying public assets...");
  copyDir(PUBLIC_DIR, DIST_DIR);

  // Render Pages for each language
  console.log("📄 Rendering pages...");
  for (const lang of ["en", "fr", "zh"]) {
    console.log(`   Language: ${lang.toUpperCase()}`);
    await buildLang(lang);
  }

  // 404 Page (English only)
  const enDict = getDict("en");
  writeHTML(
    "404.html",
    <NotFound currentLang="en" baseUrl="" dict={enDict} />
  );

  console.log("✅ Build complete! Files generated in /dist");
}

build().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
