/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout, type Dict } from "../Layout";

export const Topic: FC<{
  currentLang: string;
  baseUrl: string;
  dict: Dict;
  topic: string;
  posts: any[];
  formatTopic: (t: string) => string;
}> = ({ currentLang, baseUrl, dict, topic, posts, formatTopic }) => (
  <Layout pageTitle={formatTopic(topic)} currentLang={currentLang} baseUrl={baseUrl} dict={dict}>
    <a href={`${baseUrl}/`} class="back-home">{dict.backToBlog}</a>
    <section class="page-header">
      <h1>{formatTopic(topic)}</h1>
      <p class="page-sub">{dict.allPostsAbout} {formatTopic(topic)}</p>
    </section>
    {posts.length === 0 ? (
      <div class="empty-state">
        <p>{dict.noPostsTopic}</p>
      </div>
    ) : (
      <div class="post-list">
        {posts.map((post: any) => (
          <article class="post-card post-card-horizontal" key={post.slug}>
            <div class="post-card-body">
              <h3><a href={`${baseUrl}/post/${post.slug}/`}>{post.title}</a></h3>
              <p class="post-excerpt">{post.excerpt || post.content.substring(0, 200) + "..."}</p>
              <time class="post-date">{new Date(post.created_at).toLocaleDateString(currentLang === "zh" ? "zh-CN" : currentLang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
            </div>
          </article>
        ))}
      </div>
    )}
  </Layout>
);
