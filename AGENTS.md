# AGENTS.md — Personal Blog & Portfolio (jamespares.me)

This file contains everything an AI coding agent needs to know about this project. Read it before making any changes.

---

## 1. Project Overview

This is a minimalist, high-performance personal website and blog for **James Pares**, a British teacher living in Shenzhen (previously Shanghai) who builds AI-powered tools for language learners and educators.

The site has two main sections:
- **Landing page** (`/`): A writing-first homepage. The main column is a feed of the latest blog posts; the sidebar holds the profile, contact links, and a small "Some tools I vibe coded" list of active products. The full tools listing lives at `/products/` for sharing directly.
- **Blog** (`/blog`): A topic-based blog with two sections: Teaching and Book Reviews.

**Live site:** [jamespares.me](https://jamespares.me)

The project was originally a dynamic Node.js/Express application but has been migrated to a **fully static architecture** optimized for speed, security, and simplicity. The Express server remains for local development only.

---

## 2. Technology Stack

| Layer | Technology |
|-------|------------|
| Templates | EJS (Embedded JavaScript) |
| Content | Markdown with YAML frontmatter |
| Markdown parser | `marked` |
| Frontmatter parser | `gray-matter` |
| Local dev server | Express.js 4 |
| Static site generator | Custom Node.js script (`lib/build.js`) |
| Styling | Vanilla CSS (single file, mobile-first) |
| Fonts | Inter + Lexend via Google Fonts |
| Hosting | Cloudflare Pages |
| Email forwarding | Cloudflare Email Worker (Wrangler) |

**No frameworks** (no React, Vue, etc.). **No database** (data is static). **No CSS preprocessor**.

---

## 3. Architecture

### Static Site Generation

The canonical build output is produced by:

```bash
npm run build   # runs node lib/build.js
```

This script:
1. Cleans the `dist/` directory.
2. Copies `public/` assets (CSS, images, favicon) into `dist/`.
3. Reads blog posts from `content/posts/*.md` and products from `seed-products-data.js`.
4. Renders every EJS template into static HTML files inside `dist/`:
   - `index.html` — landing page
   - `blog/index.html` — blog home
   - `topic/<topic>/index.html` — topic listing pages
   - `post/<slug>/index.html` — individual blog posts
   - `products/index.html` — product listing
   - `products/<slug>/index.html` — individual product pages
   - `404.html` — error page

Cloudflare Pages serves the `dist/` folder. It runs `npm run build` on every push to `main`.

### Local Development Server

```bash
npm run dev     # runs node server.js
```

`server.js` is an Express app that dynamically renders EJS templates using the same data layer (`lib/data.js`). This is useful for previewing changes without running a full build. The routes are defined in `routes/public.js`.

**Important:** The Express server is **not used in production**. Any changes to `server.js` or `routes/public.js` must be mirrored in `lib/build.js` if they affect page rendering.

### Email Worker

`src/index.js` is a Cloudflare Email Worker (deployed separately via Wrangler) that forwards incoming emails to a destination address. It uses the `SEND_EMAIL` binding configured in `wrangler.jsonc`.

Deploy the worker:
```bash
npx wrangler deploy
```

Local dev for the worker:
```bash
npx wrangler dev
```

---

## 4. Directory Structure

```
├── content/
│   ├── posts/              # Blog post Markdown files
│   └── blog-config.md      # Persona & writing guidelines for AI agents
├── dist/                   # Generated static site (gitignored, build output)
├── lib/
│   ├── build.js            # Static site generator
│   └── data.js             # Data access layer (posts + products)
├── public/
│   ├── css/style.css       # Single global stylesheet
│   ├── favicon.png
│   └── profile-avatar.jpg
├── routes/
│   └── public.js           # Express routes for local dev
├── scratch/
│   └── refresh-products.js # Legacy DB utility (mostly unused now)
├── src/
│   └── index.js            # Cloudflare Email Worker entry point
├── views/
│   ├── partials/           # header.ejs, footer.ejs
│   ├── admin/              # Legacy admin templates (unused)
│   ├── 404.ejs
│   ├── error.ejs
│   ├── home.ejs            # Blog home
│   ├── landing.ejs         # Portfolio landing
│   ├── post.ejs            # Single blog post
│   ├── product.ejs         # Single product
│   ├── products.ejs        # Product listing
│   └── topic.ejs           # Topic listing
├── seed-products-data.js   # Product/portfolio data
├── server.js               # Express dev server
├── wrangler.jsonc          # Cloudflare Worker config
└── package.json
```

---

## 5. Content Management

### Blog Posts

Blog posts live in `content/posts/` as Markdown files with YAML frontmatter.

**Required frontmatter fields:**
```yaml
---
title: "Post Title"
date: 2026-04-14 09:00:00
topic: teaching    # Must be one of: teaching, books
slug: post-slug    # Used for URL: /post/post-slug/
---
```

The `slug` must match the filename (without `.md`) for `lib/data.js` to find it correctly.

Posts are sorted by `date` descending. The `topic` field drives the topic pages.

### Products / Portfolio

Products are defined as a plain JavaScript array in `seed-products-data.js`. Each product object supports these fields:

```javascript
{
  name: 'Product Name',
  tagline: 'Short description',
  description: 'Longer description',
  live_url: 'https://...',
  github_url: 'https://...',   // optional
  price: 'Free / Premium',
  status: 'active',            // or 'coming_soon'
  published: 1,                // 0 = hidden
  category: 'Teaching Tools',  // See PRODUCT_CATEGORIES in lib/data.js
  icon: '⚡',
  brand_color: '#D97706',
  metric: 'Free / Premium'     // Shown as badge
}
```

Slugs are auto-generated from `name` via `generateSlug()` in `lib/data.js`.

### Blog Writing Protocol

When writing or editing blog content, consult `content/blog-config.md`. It contains strict persona guidelines:
- Voice: Clear, Curious, Concise. British English.
- Identity: James Pares, 29, teacher in Shenzhen (moved from Shanghai in July 2026), former London local government.
- Structure: Personal hook → Broad debate → Pivot → Reasons → Conclusion.
- Sources: FT, The Economist, The Times, The Telegraph. Avoid The Guardian.
- Titles: Concise and witty. Prefer questions or "How-to" frames.

---

## 6. Build & Dev Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local Express dev server on port 3000 |
| `npm run start` | Alias for `npm run dev` |
| `npm run build` | Generate static site into `dist/` |
| `npx wrangler dev` | Run Cloudflare Email Worker locally |
| `npx wrangler deploy` | Deploy Email Worker to Cloudflare |

To preview the built site locally:
```bash
npm run build
npx serve dist
```

---

## 7. Code Style & Conventions

### JavaScript / Node.js
- Use **CommonJS** (`require` / `module.exports`) in the main app.
- Use **ES Modules** (`export default`) only in `src/index.js` (Cloudflare Worker).
- Indent with **4 spaces**.
- Use single quotes for strings.
- Prefer `const`; use `let` only when reassignment is necessary.
- Template strings (backticks) are acceptable for multi-line or interpolated strings.

### CSS
- Single global stylesheet: `public/css/style.css`.
- Mobile-first with breakpoints at `700px` and `960px`.
- CSS custom properties (variables) are defined in `:root`.
- Naming is mostly semantic (e.g., `.post-card`, `.project-grid`).

### EJS Templates
- Include partials with `<%- include('partials/header') %>`.
- Pass local variables via the second argument: `<%- include('partials/header', { pageTitle: 'Foo' }) %>`.
- Use `typeof` checks for optional variables to avoid ReferenceError in static builds:
  ```ejs
  <%= typeof pageTitle !== 'undefined' && pageTitle ? pageTitle + ' — ' : '' %>
  ```

### File Naming
- Markdown posts: kebab-case, matching the `slug` frontmatter field.
- EJS templates: lowercase, descriptive.
- JS modules: camelCase.

---

## 8. Testing

**There is no test suite in this project.** There are no unit tests, integration tests, or end-to-end tests.

When making changes, verify by:
1. Running `npm run build` and checking for errors.
2. Serving `dist/` locally and manually inspecting affected pages.
3. Checking the Express dev server (`npm run dev`) for dynamic rendering parity.

---

## 9. Deployment

### Cloudflare Pages (Main Site)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Root directory:** `/`
- Trigger: Push to `main` branch on GitHub.

### Cloudflare Email Worker
- Config: `wrangler.jsonc`
- Entry: `src/index.js`
- Deploy manually: `npx wrangler deploy`
- Environment variable for forwarding destination: `FORWARD_TO_EMAIL` (set in Cloudflare dashboard or `.dev.vars` for local dev).
- All emails send from `hey@jamespares.me` (personal/consumer projects).
- Incoming emails forward to `jamesedpares@gmail.com`.

### Legacy Notes
- A `Procfile` (`web: node server.js`) exists for legacy Railway deployment but is **not used** in the current static architecture.
- `.env` and `.env.example` contain legacy variables (SMTP, admin credentials, session secret) from the dynamic app era. They are mostly irrelevant now but may be needed if the Express dev server is extended.

---

## 10. Security Considerations

- **No authentication** is currently active in production. Admin routes and templates exist as legacy artifacts but are not wired up in `routes/public.js` or `lib/build.js`.
- **No user input** is processed in the static build. All content is author-controlled Markdown and JS data.
- **Email Worker:** The forwarding destination is controlled via the `FORWARD_TO_EMAIL` environment variable. Do not hardcode private email addresses in `src/index.js`.
- `.env`, `.dev.vars`, and `dist/` are listed in `.gitignore` and must never be committed.

---

## 11. Common Pitfalls for Agents

1. **Mirror changes in both Express and static build.** If you modify `routes/public.js`, check whether `lib/build.js` needs the same change.
2. **Slug consistency.** The Markdown filename, the `slug` frontmatter field, and any internal links must match exactly.
3. **Topic whitelist.** Only these topics are supported: `teaching`, `books`. Adding a new topic requires updating the array in `server.tsx`, `lib/build.tsx`, and `src/components/pages/Home.tsx`.
4. **No database.** Do not write code that assumes SQLite, PostgreSQL, or any other DB. All data is in-memory from `lib/data.js`.
5. **British English.** All user-facing copy and blog content must use British spelling (`organise`, `realise`, `labour`, `centre`).
