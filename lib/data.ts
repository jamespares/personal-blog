import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import productsData from '../seed-products-data';

export const DISCORD_URL = 'https://discord.gg/tB7uRTXdUp';

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
  getAll() {
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

    return enPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getRecent(limit = 15) {
    return this.getAll().slice(0, limit);
  },

  getBySlug(slug: string) {
    const filePath = path.join(postsDir, `${slug}.md`);
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
    return null;
  },

  getByTopic(topic: string) {
    return this.getAll().filter((p: any) => p.topic && p.topic.toLowerCase() === topic.toLowerCase());
  }
};
