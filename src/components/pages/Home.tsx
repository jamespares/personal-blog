/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout } from "../Layout";

export const Home: FC<{
  recentPosts: any[];
  topicPreviews: Record<string, any[]>;
  formatTopic: (t: string) => string;
}> = ({ recentPosts, topicPreviews, formatTopic }) => {
  const topics = ["teaching", "books"];

  return (
    <Layout pageTitle="Home">
      {topics.map((t) => {
        const posts = topicPreviews[t] || [];
        if (posts.length === 0) return null;
        return (
          <section class="topic-section" key={t}>
            <div class="section-header">
              <h2>{formatTopic(t)}</h2>
              <a href={`/topic/${t}/`} class="view-all">View all →</a>
            </div>
            <div class="post-grid">
              {posts.map((post: any) => (
                <article class="post-card" key={post.slug}>
                  <span class="post-topic">{formatTopic(post.topic)}</span>
                  <h3><a href={`/post/${post.slug}/`}>{post.title}</a></h3>
                  <p class="post-excerpt">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
                  <time class="post-date">{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {recentPosts.length === 0 && (
        <section class="empty-state">
          <p>No posts yet. Check back soon!</p>
        </section>
      )}
    </Layout>
  );
};
