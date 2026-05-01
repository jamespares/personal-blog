/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { marked } from "marked";

import { posts, products } from "./lib/data.js";

import { Landing } from "./src/components/pages/Landing";
import { Home } from "./src/components/pages/Home";
import { Post } from "./src/components/pages/Post";
import { Topic } from "./src/components/pages/Topic";
import { Products } from "./src/components/pages/Products";
import { Product } from "./src/components/pages/Product";
import { Terms } from "./src/components/pages/Terms";
import { Privacy } from "./src/components/pages/Privacy";
import { NotFound } from "./src/components/pages/NotFound";

const app = new Hono();
const PORT = Number(process.env.PORT) || 3000;

// Static assets
app.use("/css/*", serveStatic({ root: "./public" }));
app.use("/favicon.png", serveStatic({ path: "./public/favicon.png" }));
app.use("/profile-avatar.jpg", serveStatic({ path: "./public/profile-avatar.jpg" }));

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

function render(c: any, node: any) {
  return c.html("<!DOCTYPE html>\n" + String(node));
}

// --- Landing ---
app.get("/", (c) => {
  const recentPosts = posts.getRecent(5);
  const allProducts = products.getAll().filter((p: any) => p.published === 1);
  return render(c, <Landing allProducts={allProducts} recentPosts={recentPosts} formatTopic={formatTopic} />);
});

// --- Blog Home ---
app.get("/blog", (c) => c.redirect("/blog/"));
app.get("/blog/", (c) => {
  const recentPosts = posts.getRecent(10);
  const topicPreviews = {
    china: posts.getByTopic("china").slice(0, 3),
    education: posts.getByTopic("education"),
    politics: posts.getByTopic("politics").slice(0, 3),
    ai: posts.getByTopic("ai").slice(0, 3),
    books: posts.getByTopic("books").slice(0, 3),
  };
  return render(c, <Home recentPosts={recentPosts} topicPreviews={topicPreviews} formatTopic={formatTopic} />);
});

// --- Topics ---
const topics = ["china", "education", "politics", "ai", "books"];
for (const topic of topics) {
  app.get(`/${topic}/`, (c) => c.redirect(`/topic/${topic}/`));
  app.get(`/topic/${topic}/`, (c) => {
    const topicPosts = posts.getByTopic(topic);
    return render(c, <Topic topic={topic} posts={topicPosts} formatTopic={formatTopic} />);
  });
}

// --- Posts ---
app.get("/post/:slug/", (c) => {
  const slug = c.req.param("slug");
  const post = posts.getBySlug(slug);
  if (!post) return c.notFound();
  return render(c, <Post post={post} formatTopic={formatTopic} marked={marked} />);
});

// --- Products ---
app.get("/products", (c) => c.redirect("/products/"));
app.get("/products/", (c) => {
  return render(c, <Products activeProducts={products.getActive()} comingSoonProducts={products.getComingSoon()} />);
});

// --- Individual Product ---
app.get("/products/:slug/", (c) => {
  const slug = c.req.param("slug");
  const product = products.getBySlug(slug);
  if (!product) return c.notFound();
  return render(c, <Product product={product} marked={marked} />);
});

// --- Legal ---
app.get("/terms", (c) => c.redirect("/terms/"));
app.get("/terms/", (c) => {
  return render(c, <Terms />);
});

app.get("/privacy", (c) => c.redirect("/privacy/"));
app.get("/privacy/", (c) => {
  return render(c, <Privacy />);
});

// --- 404 ---
app.notFound((c) => {
  return render(c, <NotFound />);
});

// Start server
import { serve } from "@hono/node-server";
serve({ fetch: app.fetch, port: PORT });
console.log(`🚀 Dev server running at http://localhost:${PORT}`);
