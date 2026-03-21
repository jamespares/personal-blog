# James Pares — Personal Blog

A personal blog built with Express, EJS, and SQLite. Deployed on [Railway](https://railway.app) with a persistent volume for the database.

**Live site:** [www.jamespares.me](https://www.jamespares.me)

## Adding New Blog Posts

1. Add your new post object(s) to `seed-posts-data.js`
2. Commit and push to `main`
3. Railway redeploys automatically
4. On startup, `server.js` checks each post in `seed-posts-data.js` against the database **by title** — any post not already present is inserted automatically

> **No manual database work is needed.** New posts are seeded on every deploy. Existing posts are not duplicated or overwritten.

## Project Structure

| File | Purpose |
|------|---------|
| `server.js` | Express server, auto-seed logic, middleware |
| `seed-posts-data.js` | All blog post content (single source of truth) |
| `seed-comments-data.js` | Seed comments for posts |
| `db.js` | SQLite database setup, models, migrations |
| `views/` | EJS templates |
| `public/` | Static assets (CSS, images) |
| `routes/` | Public and admin route handlers |

## Running Locally

```bash
npm install
node server.js
# → http://localhost:3000
```

Delete `database.db` to reset and re-seed all posts from scratch.

## Deployment (Railway)

- **Service:** `web` (GitHub auto-deploy from `main`)
- **Volume:** `blog-data` mounted at `/data` (persistent SQLite database)
- **Environment variable:** `DATA_DIR=/data`
