import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(value) {
  return escapeAttr(value);
}

/**
 * Mirrors the Hugo render-image.html hook: markdown images with alt text
 * become a <figure><img><figcaption>, images without alt text stay plain
 * <img>. Raw HTML already in the markdown source is left untouched, since
 * it never becomes an mdast `image` node in the first place.
 */
function figureCaptions() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      const src = escapeAttr(node.url);
      const title = node.title ? ` title="${escapeAttr(node.title)}"` : '';
      if (node.alt) {
        const alt = escapeAttr(node.alt);
        node.type = 'html';
        node.value = `<figure><img src="${src}" alt="${alt}"${title} loading="lazy"><figcaption>${escapeHtml(node.alt)}</figcaption></figure>`;
      } else {
        node.type = 'html';
        node.value = `<img src="${src}"${title} loading="lazy">`;
      }
    });
  };
}

export async function renderMarkdown(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(figureCaptions)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
