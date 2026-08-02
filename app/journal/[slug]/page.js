import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPosts, getPostBySlug, slugifyTag } from '@/lib/posts';
import { formatIsoDate, formatLongDate } from '@/lib/dates';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} - Ujaan Mukherjee`,
    description: post.description || `Journal: writing by Ujaan Mukherjee.`,
  };
}

export default async function JournalPostPage({ params }) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <>
      <Header active="journal" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span><time dateTime={formatIsoDate(post.date)}>{formatLongDate(post.date)}</time></span>
            <span>{post.readingTime} min read</span>
            <span>Journal Entry</span>
          </div>
          <h1 className="post-headline">{post.title}</h1>
          {post.description ? <p className="subplate"><span>{post.description}</span></p> : null}
        </div>

        <div className="wrap">
          <div className="post-layout">
            <article className="post-main reveal">
              {post.tags.length ? (
                <p className="post-tags">
                  {post.tags.map((tag) => (
                    <a className="tag" href={`/tags/${slugifyTag(tag)}`} key={tag}>{tag}</a>
                  ))}
                </p>
              ) : null}

              <div className="post-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

              <p className="post-back"><a href="/journal">All journal entries</a></p>
            </article>

            <aside className="post-aside reveal">
              <p className="post-more__title">More from the Journal</p>
              {others.length ? (
                <ul className="post-more__list">
                  {others.map((p) => (
                    <li key={p.slug}><a href={`/journal/${p.slug}`}>{p.title}</a></li>
                  ))}
                </ul>
              ) : (
                <p className="post-more__empty">More on their way.</p>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
