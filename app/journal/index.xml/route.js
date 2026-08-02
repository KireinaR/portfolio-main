import { getAllPosts } from '@/lib/posts';
import { formatRfc822 } from '@/lib/dates';

const SITE_URL = 'https://ujaanmukherjee.com';

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/journal/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${formatRfc822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0">
  <channel>
    <title>Journal - Ujaan Mukherjee</title>
    <link>${SITE_URL}/journal</link>
    <description>Writing by Ujaan Mukherjee: software, algorithms, and whatever else is on the desk.</description>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
