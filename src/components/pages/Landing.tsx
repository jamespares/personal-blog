/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout } from "../Layout";
import { DISCORD_URL } from "../../../lib/data.js";

const LinkedInIcon20 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XIcon20 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GitHubIcon20 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);

export const Landing: FC<{
  allProducts: any[];
  recentPosts: any[];
  formatTopic: (t: string) => string;
}> = ({ allProducts, recentPosts, formatTopic }) => {
  const activeProducts = allProducts.filter((p: any) => p.status === "active");

  return (
    <Layout wideLayout>
      <div class="dashboard-layout">
        <aside class="dashboard-sidebar">
          <div class="sidebar-sticky">
            <div class="profile-section">
              <h1 class="profile-name">James Pares</h1>
              <p class="profile-location">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Shenzhen
              </p>
              <p class="profile-bio">British Teacher and Technophile</p>
            </div>
            <div class="sidebar-social">
              <a href="https://www.linkedin.com/in/james-p-ba7653207/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon20 /></a>
              <a href="https://x.com/jamespareslfg" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><XIcon20 /></a>
              <a href="https://github.com/jamespares" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon20 /></a>
            </div>
            <a href="mailto:jamesedpares@gmail.com" class="sidebar-cta"><MailIcon /> Get in touch</a>
            <p class="sidebar-discord">
              Teacher or developer? <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Join the Technical Teachers Discord</a>.
            </p>
            <div class="sidebar-tools">
              <h2 class="sidebar-tools-heading">Some tools I vibe coded</h2>
              <ul class="sidebar-tools-list">
                {activeProducts.map((product: any) => (
                  <li key={product.slug}>
                    <a href={product.live_url} target="_blank" rel="noopener noreferrer">{product.name}</a>
                    <p>{product.tagline}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div class="dashboard-main">
          {recentPosts.length > 0 && (
            <section class="latest-writing">
              <div class="writing-header">
                <h2 class="section-label">Recent Writing</h2>
                <a href="/blog" class="view-all-link">View all →</a>
              </div>
              <div class="writing-list">
                {recentPosts.map((post: any) => (
                  <article class="writing-item" key={post.slug}>
                    <time class="writing-date">{new Date(post.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</time>
                    <div class="writing-main">
                      <a href={`/post/${post.slug}/`} class="writing-link">{post.title}</a>
                      <p class="writing-excerpt">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
                    </div>
                    <span class="writing-topic">{formatTopic(post.topic)}</span>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};
