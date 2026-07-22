/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout } from "../Layout";

export const Post: FC<{
  post: any;
  formatTopic: (t: string) => string;
  marked: any;
}> = ({ post, formatTopic, marked }) => {
  return (
    <Layout pageTitle={post.title} metaDescription={post.excerpt || post.content.substring(0, 160)}>
      <a href="/blog/" class="back-home">← Back to blog</a>
      <article class="single-post">
        <header class="post-header">
          <span class="post-topic">{formatTopic(post.topic)}</span>
          <h1>{post.title}</h1>
          <time class="post-date">{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
          <p class="post-author"><em>by <a href="https://www.linkedin.com/in/james-p-ba7653207/" target="_blank" rel="noopener" class="author-link">James Pares</a></em></p>
        </header>
        <div class="post-content" dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }} />
        {post.sources && (
          <div class="post-sources">
            <h3>Sources</h3>
            <div class="sources-content" dangerouslySetInnerHTML={{ __html: marked.parse(post.sources) }} />
          </div>
        )}
        <div class="post-share">
          <span>Share:</span>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`/post/${post.slug}`)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener">Twitter</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/post/${post.slug}`)}`} target="_blank" rel="noopener">LinkedIn</a>
          <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`/post/${post.slug}`)}`} rel="noopener">Email</a>
        </div>
      </article>
    </Layout>
  );
};
