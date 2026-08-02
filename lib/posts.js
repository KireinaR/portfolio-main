import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { renderMarkdown } from './markdown';

const JOURNAL_DIR = path.join(process.cwd(), 'journal');
const WORDS_PER_MINUTE = 200;

export function slugifyTag(tag) {
  return String(tag).trim().toLowerCase().replace(/\s+/g, '-');
}

function getPostSlugs() {
  if (!fs.existsSync(JOURNAL_DIR)) return [];
  return fs
    .readdirSync(JOURNAL_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((slug) => fs.existsSync(path.join(JOURNAL_DIR, slug, 'index.md')));
}

function readingTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function plainify(markdown) {
  return markdown
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(markdown, maxLen = 200) {
  const text = plainify(markdown);
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen)}…`;
}

export async function getPostBySlug(slug) {
  const filePath = path.join(JOURNAL_DIR, slug, 'index.md');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const contentHtml = await renderMarkdown(content);
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    slug,
    title: data.title || slug,
    date: new Date(data.date),
    draft: Boolean(data.draft),
    description: data.description || '',
    tags,
    readingTime: readingTime(content),
    summary: excerpt(content),
    contentHtml,
  };
}

export async function getAllPosts({ includeDrafts = false } = {}) {
  const posts = await Promise.all(getPostSlugs().map((slug) => getPostBySlug(slug)));
  return posts
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date - a.date);
}

export async function getAllTags() {
  const posts = await getAllPosts();
  const map = new Map();

  for (const post of posts) {
    for (const tag of post.tags) {
      const tagSlug = slugifyTag(tag);
      if (!map.has(tagSlug)) map.set(tagSlug, { tag, tagSlug, posts: [] });
      map.get(tagSlug).posts.push(post);
    }
  }

  return Array.from(map.values()).sort((a, b) => b.posts.length - a.posts.length);
}

export async function getPostsByTagSlug(tagSlug) {
  const tags = await getAllTags();
  return tags.find((t) => t.tagSlug === tagSlug) || null;
}
