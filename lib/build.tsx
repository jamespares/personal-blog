/** @jsxImportSource hono/jsx */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

// @ts-ignore — CJS modules imported via tsx
import { posts, products } from "./data.js";

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

function renderJSX(node: any): string {
  return String(node);
}

function writeHTML(outputPath: string, node: any) {
  const targetPath = path.join(DIST_DIR, outputPath);
  ensureDir(path.dirname(targetPath));
  const html = "<!DOCTYPE html>\n" + renderJSX(node);
  fs.writeFileSync(targetPath, html);
}

function formatTopic(topic: string) {
  if (!topic) return "";
  const labels: Record<string, string> = {
    china: "China",
    education: "Education",
    politics: "Politics",
    ai: "AI",
    books: "Book Reviews"
  };
  return labels[topic.toLowerCase()] || topic.charAt(0).toUpperCase() + topic.slice(1);
}

async function build() {
  console.log("🚀 Starting static build (Hono JSX)...");

  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  ensureDir(DIST_DIR);

  console.log("📦 Copying public assets...");
  copyDir(PUBLIC_DIR, DIST_DIR);

  console.log("📄 Rendering pages...");

  // Landing Page
  const recentPosts = posts.getRecent(5);
  const allProducts = products.getAll().filter((p: any) => p.published === 1);
  writeHTML(
    "index.html",
    <Landing allProducts={allProducts} recentPosts={recentPosts} formatTopic={formatTopic} />
  );

  // Blog Home
  const blogRecentPosts = posts.getRecent(10);
  const topicPreviews = {
    china: posts.getByTopic("china").slice(0, 3),
    education: posts.getByTopic("education"),
    politics: posts.getByTopic("politics").slice(0, 3),
    ai: posts.getByTopic("ai").slice(0, 3),
    books: posts.getByTopic("books").slice(0, 3),
  };
  writeHTML(
    "blog/index.html",
    <Home recentPosts={blogRecentPosts} topicPreviews={topicPreviews} formatTopic={formatTopic} />
  );

  // Topics
  const topics = ["china", "education", "politics", "ai", "books"];
  for (const topic of topics) {
    const topicPosts = posts.getByTopic(topic);
    writeHTML(
      `topic/${topic}/index.html`,
      <Topic topic={topic} posts={topicPosts} formatTopic={formatTopic} />
    );
  }

  // Individual Posts
  const allPosts = posts.getAll();
  for (const post of allPosts) {
    writeHTML(
      `post/${post.slug}/index.html`,
      <Post post={post} formatTopic={formatTopic} marked={marked} />
    );
  }

  // Products Listing
  const activeProducts = products.getActive();
  const comingSoonProducts = products.getComingSoon();
  writeHTML(
    "products/index.html",
    <Products activeProducts={activeProducts} comingSoonProducts={comingSoonProducts} />
  );

  // Individual Products
  for (const product of allProducts) {
    writeHTML(
      `products/${product.slug}/index.html`,
      <Product product={product} marked={marked} />
    );
  }

  // Legal Pages
  writeHTML("terms/index.html", <Terms />);
  writeHTML("privacy/index.html", <Privacy />);

  // 404 Page
  writeHTML("404.html", <NotFound />);

  console.log("✅ Build complete! Files generated in /dist");
}

build().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
