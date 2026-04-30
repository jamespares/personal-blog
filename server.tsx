/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { marked } from "marked";

import { posts, products } from "./lib/data.js";
import { getDict } from "./lib/i18n.js";

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

function formatTopic(topic: string, dict: any) {
  if (!topic) return "";
  return (
    dict.topicLabels[topic.toLowerCase()] ||
    topic.charAt(0).toUpperCase() + topic.slice(1)
  );
}

function render(c: any, node: any) {
  return c.html("<!DOCTYPE html>\n" + String(node));
}

// Helper to get lang + baseUrl from path
function getLangBase(path: string): { lang: string; baseUrl: string } {
  if (path.startsWith("/fr")) return { lang: "fr", baseUrl: "/fr" };
  if (path.startsWith("/zh")) return { lang: "zh", baseUrl: "/zh" };
  return { lang: "en", baseUrl: "" };
}

// --- Landing ---
app.get("/", (c) => {
  const { lang, baseUrl } = getLangBase(c.req.path);
  const dict = getDict(lang);
  const recentPosts = posts.getRecent(5, lang);
  const allProducts = products.getAll().filter((p: any) => p.published === 1);
  return render(c, <Landing currentLang={lang} baseUrl={baseUrl} dict={dict} allProducts={allProducts} recentPosts={recentPosts} formatTopic={(t) => formatTopic(t, dict)} />);
});
app.get("/fr", (c) => c.redirect("/fr/"));
app.get("/zh", (c) => c.redirect("/zh/"));
app.get("/fr/", (c) => {
  const dict = getDict("fr");
  const recentPosts = posts.getRecent(5, "fr");
  const allProducts = products.getAll().filter((p: any) => p.published === 1);
  return render(c, <Landing currentLang="fr" baseUrl="/fr" dict={dict} allProducts={allProducts} recentPosts={recentPosts} formatTopic={(t) => formatTopic(t, dict)} />);
});
app.get("/zh/", (c) => {
  const dict = getDict("zh");
  const recentPosts = posts.getRecent(5, "zh");
  const allProducts = products.getAll().filter((p: any) => p.published === 1);
  return render(c, <Landing currentLang="zh" baseUrl="/zh" dict={dict} allProducts={allProducts} recentPosts={recentPosts} formatTopic={(t) => formatTopic(t, dict)} />);
});

// --- Blog Home ---
app.get("/blog", (c) => c.redirect("/blog/"));
app.get("/blog/", (c) => {
  const { lang, baseUrl } = getLangBase(c.req.path);
  const dict = getDict(lang);
  const recentPosts = posts.getRecent(10, lang);
  const topicPreviews = {
    china: posts.getByTopic("china", lang).slice(0, 3),
    education: posts.getByTopic("education", lang),
    politics: posts.getByTopic("politics", lang).slice(0, 3),
    ai: posts.getByTopic("ai", lang).slice(0, 3),
    books: posts.getByTopic("books", lang).slice(0, 3),
  };
  return render(c, <Home currentLang={lang} baseUrl={baseUrl} dict={dict} recentPosts={recentPosts} topicPreviews={topicPreviews} formatTopic={(t) => formatTopic(t, dict)} />);
});
app.get("/fr/blog", (c) => c.redirect("/fr/blog/"));
app.get("/fr/blog/", (c) => {
  const dict = getDict("fr");
  const recentPosts = posts.getRecent(10, "fr");
  const topicPreviews = {
    china: posts.getByTopic("china", "fr").slice(0, 3),
    education: posts.getByTopic("education", "fr"),
    politics: posts.getByTopic("politics", "fr").slice(0, 3),
    ai: posts.getByTopic("ai", "fr").slice(0, 3),
    books: posts.getByTopic("books", "fr").slice(0, 3),
  };
  return render(c, <Home currentLang="fr" baseUrl="/fr" dict={dict} recentPosts={recentPosts} topicPreviews={topicPreviews} formatTopic={(t) => formatTopic(t, dict)} />);
});
app.get("/zh/blog", (c) => c.redirect("/zh/blog/"));
app.get("/zh/blog/", (c) => {
  const dict = getDict("zh");
  const recentPosts = posts.getRecent(10, "zh");
  const topicPreviews = {
    china: posts.getByTopic("china", "zh").slice(0, 3),
    education: posts.getByTopic("education", "zh"),
    politics: posts.getByTopic("politics", "zh").slice(0, 3),
    ai: posts.getByTopic("ai", "zh").slice(0, 3),
    books: posts.getByTopic("books", "zh").slice(0, 3),
  };
  return render(c, <Home currentLang="zh" baseUrl="/zh" dict={dict} recentPosts={recentPosts} topicPreviews={topicPreviews} formatTopic={(t) => formatTopic(t, dict)} />);
});

// --- Topics ---
const topics = ["china", "education", "politics", "ai", "books"];
for (const topic of topics) {
  app.get(`/${topic}/`, (c) => c.redirect(`/topic/${topic}/`));
  app.get(`/topic/${topic}/`, (c) => {
    const { lang, baseUrl } = getLangBase(c.req.path);
    const dict = getDict(lang);
    const topicPosts = posts.getByTopic(topic, lang);
    return render(c, <Topic currentLang={lang} baseUrl={baseUrl} dict={dict} topic={topic} posts={topicPosts} formatTopic={(t) => formatTopic(t, dict)} />);
  });
  app.get(`/fr/topic/${topic}/`, (c) => {
    const dict = getDict("fr");
    const topicPosts = posts.getByTopic(topic, "fr");
    return render(c, <Topic currentLang="fr" baseUrl="/fr" dict={dict} topic={topic} posts={topicPosts} formatTopic={(t) => formatTopic(t, dict)} />);
  });
  app.get(`/zh/topic/${topic}/`, (c) => {
    const dict = getDict("zh");
    const topicPosts = posts.getByTopic(topic, "zh");
    return render(c, <Topic currentLang="zh" baseUrl="/zh" dict={dict} topic={topic} posts={topicPosts} formatTopic={(t) => formatTopic(t, dict)} />);
  });
}

// --- Posts ---
app.get("/post/:slug/", (c) => {
  const { lang, baseUrl } = getLangBase(c.req.path);
  const dict = getDict(lang);
  const slug = c.req.param("slug");
  const post = posts.getBySlug(slug, lang);
  if (!post) return c.notFound();
  return render(c, <Post currentLang={lang} baseUrl={baseUrl} dict={dict} post={post} formatTopic={(t) => formatTopic(t, dict)} marked={marked} />);
});
app.get("/fr/post/:slug/", (c) => {
  const dict = getDict("fr");
  const slug = c.req.param("slug");
  const post = posts.getBySlug(slug, "fr");
  if (!post) return c.notFound();
  return render(c, <Post currentLang="fr" baseUrl="/fr" dict={dict} post={post} formatTopic={(t) => formatTopic(t, dict)} marked={marked} />);
});
app.get("/zh/post/:slug/", (c) => {
  const dict = getDict("zh");
  const slug = c.req.param("slug");
  const post = posts.getBySlug(slug, "zh");
  if (!post) return c.notFound();
  return render(c, <Post currentLang="zh" baseUrl="/zh" dict={dict} post={post} formatTopic={(t) => formatTopic(t, dict)} marked={marked} />);
});

// --- Products ---
app.get("/products", (c) => c.redirect("/products/"));
app.get("/products/", (c) => {
  const { lang, baseUrl } = getLangBase(c.req.path);
  const dict = getDict(lang);
  return render(c, <Products currentLang={lang} baseUrl={baseUrl} dict={dict} activeProducts={products.getActive()} comingSoonProducts={products.getComingSoon()} />);
});
app.get("/fr/products", (c) => c.redirect("/fr/products/"));
app.get("/fr/products/", (c) => {
  const dict = getDict("fr");
  return render(c, <Products currentLang="fr" baseUrl="/fr" dict={dict} activeProducts={products.getActive()} comingSoonProducts={products.getComingSoon()} />);
});
app.get("/zh/products", (c) => c.redirect("/zh/products/"));
app.get("/zh/products/", (c) => {
  const dict = getDict("zh");
  return render(c, <Products currentLang="zh" baseUrl="/zh" dict={dict} activeProducts={products.getActive()} comingSoonProducts={products.getComingSoon()} />);
});

// --- Individual Product ---
app.get("/products/:slug/", (c) => {
  const { lang, baseUrl } = getLangBase(c.req.path);
  const dict = getDict(lang);
  const slug = c.req.param("slug");
  const product = products.getBySlug(slug);
  if (!product) return c.notFound();
  return render(c, <Product currentLang={lang} baseUrl={baseUrl} dict={dict} product={product} marked={marked} />);
});
app.get("/fr/products/:slug/", (c) => {
  const dict = getDict("fr");
  const slug = c.req.param("slug");
  const product = products.getBySlug(slug);
  if (!product) return c.notFound();
  return render(c, <Product currentLang="fr" baseUrl="/fr" dict={dict} product={product} marked={marked} />);
});
app.get("/zh/products/:slug/", (c) => {
  const dict = getDict("zh");
  const slug = c.req.param("slug");
  const product = products.getBySlug(slug);
  if (!product) return c.notFound();
  return render(c, <Product currentLang="zh" baseUrl="/zh" dict={dict} product={product} marked={marked} />);
});

// --- Legal ---
app.get("/terms", (c) => c.redirect("/terms/"));
app.get("/terms/", (c) => {
  const { lang, baseUrl } = getLangBase(c.req.path);
  const dict = getDict(lang);
  return render(c, <Terms currentLang={lang} baseUrl={baseUrl} dict={dict} />);
});
app.get("/fr/terms", (c) => c.redirect("/fr/terms/"));
app.get("/fr/terms/", (c) => {
  const dict = getDict("fr");
  return render(c, <Terms currentLang="fr" baseUrl="/fr" dict={dict} />);
});
app.get("/zh/terms", (c) => c.redirect("/zh/terms/"));
app.get("/zh/terms/", (c) => {
  const dict = getDict("zh");
  return render(c, <Terms currentLang="zh" baseUrl="/zh" dict={dict} />);
});

app.get("/privacy", (c) => c.redirect("/privacy/"));
app.get("/privacy/", (c) => {
  const { lang, baseUrl } = getLangBase(c.req.path);
  const dict = getDict(lang);
  return render(c, <Privacy currentLang={lang} baseUrl={baseUrl} dict={dict} />);
});
app.get("/fr/privacy", (c) => c.redirect("/fr/privacy/"));
app.get("/fr/privacy/", (c) => {
  const dict = getDict("fr");
  return render(c, <Privacy currentLang="fr" baseUrl="/fr" dict={dict} />);
});
app.get("/zh/privacy", (c) => c.redirect("/zh/privacy/"));
app.get("/zh/privacy/", (c) => {
  const dict = getDict("zh");
  return render(c, <Privacy currentLang="zh" baseUrl="/zh" dict={dict} />);
});

// --- 404 ---
app.notFound((c) => {
  const { lang, baseUrl } = getLangBase(c.req.path);
  const dict = getDict(lang);
  return render(c, <NotFound currentLang={lang} baseUrl={baseUrl} dict={dict} />);
});

// Start server
import { serve } from "@hono/node-server";
serve({ fetch: app.fetch, port: PORT });
console.log(`🚀 Dev server running at http://localhost:${PORT}`);
