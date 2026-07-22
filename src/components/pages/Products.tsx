/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout } from "../Layout";

export const Products: FC<{
  activeProducts: any[];
}> = ({ activeProducts }) => {
  return (
    <Layout pageTitle="Products">
      <section class="page-header">
        <h1>Products</h1>
        <p class="page-sub">Mini-SaaS products and AI tools for teachers and learners.</p>
      </section>

      {activeProducts.length > 0 && (
        <section class="products-section">
          <div class="section-header"><h2>Active</h2></div>
          <div class="products-grid">
            {activeProducts.map((product: any) => (
              <article class="product-card" key={product.slug}>
                {product.image_url && (
                  <div class="product-image"><img src={product.image_url} alt={product.name} /></div>
                )}
                <div class="product-body">
                  <h3><a href={`/products/${product.slug}/`}>{product.name}</a></h3>
                  {product.tagline && <p class="product-tagline">{product.tagline}</p>}
                  <p class="product-excerpt">{product.description.substring(0, 120)}...</p>
                  <div class="product-meta">
                    <span class="product-price">{product.price}</span>
                    <a href={`/products/${product.slug}/`} class="product-link">Learn more →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeProducts.length === 0 && (
        <section class="empty-state"><p>No products yet. Check back soon!</p></section>
      )}
    </Layout>
  );
};
