/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout, type Dict } from "../Layout";

export const Products: FC<{
  currentLang: string;
  baseUrl: string;
  dict: Dict;
  activeProducts: any[];
  comingSoonProducts: any[];
}> = ({ currentLang, baseUrl, dict, activeProducts, comingSoonProducts }) => {
  const learnMore = currentLang === "fr" ? "En savoir plus →" : currentLang === "zh" ? "了解更多 →" : "Learn more →";
  const noProducts = currentLang === "fr" ? "Aucun produit pour l\'instant. Revenez bientôt !" : currentLang === "zh" ? "暂无产品。请稍后再来查看！" : "No products yet. Check back soon!";
  const pageSub = currentLang === "fr" ? "Produits mini-SaaS et outils IA pour enseignants et apprenants." : currentLang === "zh" ? "面向教师和学习者的小型SaaS产品和AI工具。" : "Mini-SaaS products and AI tools for teachers and learners.";

  return (
    <Layout pageTitle={dict.productsTitle} currentLang={currentLang} baseUrl={baseUrl} dict={dict} showLegal>
      <section class="page-header">
        <h1>{dict.productsTitle}</h1>
        <p class="page-sub">{pageSub}</p>
      </section>

      {activeProducts.length > 0 && (
        <section class="products-section">
          <div class="section-header"><h2>{dict.productsActive}</h2></div>
          <div class="products-grid">
            {activeProducts.map((product: any) => (
              <article class="product-card" key={product.slug}>
                {product.image_url && (
                  <div class="product-image"><img src={product.image_url} alt={product.name} /></div>
                )}
                <div class="product-body">
                  <h3><a href={`${baseUrl}/products/${product.slug}/`}>{product.name}</a></h3>
                  {product.tagline && <p class="product-tagline">{product.tagline}</p>}
                  <p class="product-excerpt">{product.description.substring(0, 120)}...</p>
                  <div class="product-meta">
                    <span class="product-price">{product.price}</span>
                    <a href={`${baseUrl}/products/${product.slug}/`} class="product-link">{learnMore}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {comingSoonProducts.length > 0 && (
        <section class="products-section">
          <div class="section-header"><h2>{dict.productsComingSoon}</h2></div>
          <div class="products-grid">
            {comingSoonProducts.map((product: any) => (
              <article class="product-card coming-soon" key={product.slug}>
                {product.image_url && (
                  <div class="product-image"><img src={product.image_url} alt={product.name} /></div>
                )}
                <div class="product-body">
                  <h3>{product.name}</h3>
                  {product.tagline && <p class="product-tagline">{product.tagline}</p>}
                  <p class="product-excerpt">{product.description.substring(0, 120)}...</p>
                  <div class="product-meta">
                    <span class="product-badge">{dict.productsComingSoon}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeProducts.length === 0 && comingSoonProducts.length === 0 && (
        <section class="empty-state"><p>{noProducts}</p></section>
      )}
    </Layout>
  );
};
