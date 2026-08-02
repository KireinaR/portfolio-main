import { getAllPosts } from '@/lib/posts';
import { formatShortDate } from '@/lib/dates';

export async function GET() {
  const posts = await getAllPosts();

  const body = posts.map((post) => ({
    title: post.title,
    url: `/journal/${post.slug}`,
    date: formatShortDate(post.date),
  }));

  return Response.json(body, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
