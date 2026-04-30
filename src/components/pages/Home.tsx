/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout, type Dict } from "../Layout";

export const Home: FC<{
  currentLang: string;
  baseUrl: string;
  dict: Dict;
  recentPosts: any[];
  topicPreviews: Record<string, any[]>;
  formatTopic: (t: string) => string;
}> = ({ currentLang, baseUrl, dict, recentPosts, topicPreviews, formatTopic }) => {
  const topics = ["education", "ai", "china", "politics", "books"];

  return (
    <Layout pageTitle="Home" currentLang={currentLang} baseUrl={baseUrl} dict={dict}>
      {topics.map((t) => {
        const posts = topicPreviews[t] || [];
        if (posts.length === 0) return null;
        return (
          <section class="topic-section" key={t}>
            <div class="section-header">
              <h2>{formatTopic(t)}</h2>
              <a href={`${baseUrl}/topic/${t}/`} class="view-all">{dict.viewAll}</a>
            </div>
            <div class="post-grid">
              {posts.map((post: any) => (
                <article class="post-card" key={post.slug}>
                  <span class="post-topic">{formatTopic(post.topic)}</span>
                  <h3><a href={`${baseUrl}/post/${post.slug}/`}>{post.title}</a></h3>
                  <p class="post-excerpt">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
                  <time class="post-date">{new Date(post.created_at).toLocaleDateString(currentLang === "zh" ? "zh-CN" : currentLang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {recentPosts.length === 0 && (
        <section class="empty-state">
          <p>{dict.noPostsYet}</p>
        </section>
      )}
    </Layout>
  );
};
