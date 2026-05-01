/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout } from "../Layout";

export const NotFound: FC = () => (
  <Layout pageTitle="Page not found">
    <section class="message-page">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" class="btn">← Back to home</a>
    </section>
  </Layout>
);
