/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout, type Dict } from "../Layout";

export const Post: FC<{
  currentLang: string;
  baseUrl: string;
  dict: Dict;
  post: any;
  formatTopic: (t: string) => string;
  marked: any;
}> = ({ currentLang, baseUrl, dict, post, formatTopic, marked }) => {
  const shareLabel = currentLang === "fr" ? "Partager :" : currentLang === "zh" ? "分享：" : "Share:";
  const sourcesLabel = currentLang === "fr" ? "Sources" : currentLang === "zh" ? "来源" : "Sources";

  return (
    <Layout pageTitle={post.title} metaDescription={post.excerpt || post.content.substring(0, 160)} currentLang={currentLang} dict={dict}>
      <a href={`${baseUrl}/`} class="back-home">{dict.backToHome}</a>
      <article class="single-post">
        <header class="post-header">
          <span class="post-topic">{formatTopic(post.topic)}</span>
          <h1>{post.title}</h1>
          <time class="post-date">{new Date(post.created_at).toLocaleDateString(currentLang === "zh" ? "zh-CN" : currentLang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
          <p class="post-author"><em>{dict.heroByline} <a href="https://www.linkedin.com/in/james-p-ba7653207/" target="_blank" rel="noopener" class="author-link">James Pares</a></em></p>
        </header>
        {post._fallback && (
          <div class="lang-notice">
            <p>🌐 {dict.langNotice}</p>
          </div>
        )}
        <div class="post-content" dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }} />
        {post.sources && (
          <div class="post-sources">
            <h3>{sourcesLabel}</h3>
            <div class="sources-content" dangerouslySetInnerHTML={{ __html: marked.parse(post.sources) }} />
          </div>
        )}
        <div class="post-share">
          <span>{shareLabel}</span>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${baseUrl}/post/${post.slug}`)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener">Twitter</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${baseUrl}/post/${post.slug}`)}`} target="_blank" rel="noopener">LinkedIn</a>
          <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`${baseUrl}/post/${post.slug}`)}`} rel="noopener">Email</a>
        </div>
      </article>
    </Layout>
  );
};
