/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout, type Dict } from "../Layout";

export const NotFound: FC<{
  currentLang: string;
  baseUrl: string;
  dict: Dict;
}> = ({ currentLang, baseUrl, dict }) => (
  <Layout pageTitle={dict.pageNotFound} currentLang={currentLang} baseUrl={baseUrl} dict={dict}>
    <section class="message-page">
      <h1>404</h1>
      <p>{dict.pageNotFoundDesc}</p>
      <a href={`${baseUrl}/`} class="btn">{dict.backToHome}</a>
    </section>
  </Layout>
);
