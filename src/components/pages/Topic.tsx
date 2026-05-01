/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout } from "../Layout";

export const Topic: FC<{
  topic: string;
  posts: any[];
  formatTopic: (t: string) => string;
}> = ({ topic, posts, formatTopic }) => (
  <Layout pageTitle={formatTopic(topic)}>
    <a href="/" class="back-home">← Back to blog</a>
    <section class="page-header">
      <h1>{formatTopic(topic)}</h1>
      <p class="page-sub">All posts about {formatTopic(topic)}</p>
    </section>
    {posts.length === 0 ? (
      <div class="empty-state">
        <p>No posts in this topic yet. Check back soon!</p>
      </div>
    ) : (
      <div class="post-list">
        {posts.map((post: any) => (
          <article class="post-card post-card-horizontal" key={post.slug}>
            <div class="post-card-body">
              <h3><a href={`/post/${post.slug}/`}>{post.title}</a></h3>
              <p class="post-excerpt">{post.excerpt || post.content.substring(0, 200) + "..."}</p>
              <time class="post-date">{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
            </div>
          </article>
        ))}
      </div>
    )}
  </Layout>
);
