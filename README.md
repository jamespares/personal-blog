# James Pares — Personal Blog & Portfolio

A minimalist, high-performance personal website and blog built with a custom **Static Site Generator** using EJS and Markdown.

**Live site:** [jamespares.me](https://jamespares.me)

## Architecture

This site is migrated from a dynamic Node.js server to a **fully static architecture**, optimized for speed, security, and simplicity.

- **Frontend**: EJS (Embedded JavaScript) templates.
- **Content**: Markdown files (`.md`) for blog posts.
- **Generator**: A custom build script (`lib/build.js`) that compiles the site into a `dist/` folder.
- **Hosting**: Deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

## Adding Content

### 1. Blog Posts
Blog posts live in `content/posts/` as standard Markdown files. Each file needs a frontmatter block at the top:

```markdown
---
title: "My New Post"
date: 2026-04-14 09:00:00
topic: education
slug: my-new-post
---

Post content goes here...
```

### 2. Products
Portfolio products are managed in `seed-products-data.js`.

### 3. Publishing
When you push any changes to the `main` branch on GitHub:
1. Cloudflare Pages detects the commit.
2. It runs `npm run build`.
3. The site is redeployed automatically.

## Project Structure

| File/Folder | Purpose |
|------|---------|
| `lib/build.js` | The static site generator script |
| `content/posts/` | Blog post Markdown files |
| `seed-products-data.js` | Data for the products portfolio |
| `views/` | EJS templates for the site layout |
| `public/` | Static assets (CSS, images) |
| `dist/` | The generated static site (auto-created on build) |

## Running Locally

To build the site locally:
```bash
npm install
npm run build
```

To view the site locally, you can serve the `dist` folder using any static server:
```bash
npx serve dist
```

## Deployment (Cloudflare Pages)

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `/`

---

*Built with a focus on simplicity, "realpolitik," and avoiding AI slop.*
