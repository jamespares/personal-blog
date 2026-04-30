import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import productsData from '../seed-products-data';

const PRODUCT_CATEGORIES = ['Learn French', 'Learn Chinese', 'Learn English', 'Teaching Tools'];

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function attachSlug(product: any) {
  return { ...product, slug: generateSlug(product.name) };
}

export const products = {
  getAll() {
    return productsData.map(attachSlug);
  },
  getActive() {
    return productsData
      .filter((p: any) => p.published === 1 && p.status === 'active')
      .map(attachSlug);
  },
  getComingSoon() {
    return productsData
      .filter((p: any) => p.published === 1 && p.status === 'coming_soon')
      .map(attachSlug);
  },
  getBySlug(slug: string) {
    return productsData.find((p: any) => generateSlug(p.name) === slug);
  },
  getByCategory(category: string) {
    return productsData
      .filter((p: any) => p.published === 1 && p.status === 'active' && p.category === category)
      .map(attachSlug);
  },
  getCategories() {
    return PRODUCT_CATEGORIES;
  }
};

const postsDir = path.join(__dirname, '../content/posts');

export const posts = {
  getAll(lang = 'en') {
    if (!fs.existsSync(postsDir)) return [];
    const files = fs.readdirSync(postsDir);
    const enPosts = files
      .filter((file: string) => file.endsWith('.md') && !file.match(/\.(fr|zh)\.md$/))
      .map((file: string) => {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        return {
          ...data,
          slug,
          content,
          created_at: data.date || new Date().toISOString()
        };
      });

    if (lang === 'en') {
      return enPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const ext = `.${lang}.md`;
    const translatedSlugs = new Set();
    const translatedPosts = files
      .filter((file: string) => file.endsWith(ext))
      .map((file: string) => {
        const slug = file.replace(ext, '');
        translatedSlugs.add(slug);
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        return {
          ...data,
          slug,
          content,
          created_at: data.date || new Date().toISOString()
        };
      });

    const fallbackPosts = enPosts
      .filter((p: any) => !translatedSlugs.has(p.slug))
      .map((p: any) => ({ ...p, _fallback: true }));

    const allPosts = [...translatedPosts, ...fallbackPosts];
    return allPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getRecent(limit = 15, lang = 'en') {
    return this.getAll(lang).slice(0, limit);
  },

  getBySlug(slug: string, lang = 'en') {
    const ext = lang === 'en' ? '.md' : `.${lang}.md`;
    const filePath = path.join(postsDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      return {
        ...data,
        slug,
        content,
        created_at: data.date || new Date().toISOString()
      };
    }
    if (lang !== 'en') {
      const enPath = path.join(postsDir, `${slug}.md`);
      if (fs.existsSync(enPath)) {
        const fileContent = fs.readFileSync(enPath, 'utf8');
        const { data, content } = matter(fileContent);
        return {
          ...data,
          slug,
          content,
          created_at: data.date || new Date().toISOString(),
          _fallback: true
        };
      }
    }
    return null;
  },

  getByTopic(topic: string, lang = 'en') {
    return this.getAll(lang).filter((p: any) => p.topic && p.topic.toLowerCase() === topic.toLowerCase());
  }
};
