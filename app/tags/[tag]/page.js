import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllTags, getPostsByTagSlug, slugifyTag } from '@/lib/posts';
import { formatIsoDate, formatMediumDate } from '@/lib/dates';

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tagSlug }) => ({ tag: tagSlug }));
}

export async function generateMetadata({ params }) {
  const { tag: tagSlug } = await params;
  const entry = await getPostsByTagSlug(tagSlug);
  if (!entry) return {};
  return {
    title: `${entry.tag} - Ujaan Mukherjee`,
    description: `Journal: writing by Ujaan Mukherjee.`,
  };
}

export default async function TagPage({ params }) {
  const { tag: tagSlug } = await params;
  const entry = await getPostsByTagSlug(tagSlug);
  if (!entry) notFound();

  const { tag, posts } = entry;

  return (
    <>
      <Header active="journal" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span>Page IV</span>
            <span>{tag.toUpperCase()}</span>
            <span>
              <a className="rss-badge" href="/journal/index.xml">
                <span className="rss-badge__dot" aria-hidden="true"></span>RSS
              </a>
            </span>
          </div>
          <h1 className="nameplate nameplate--page">{tag}</h1>
        </div>

        <div className="wrap">
          <section className="reveal">
            <ol className="journal-list">
              {posts.map((post) => (
                <li className="journal-entry" key={post.slug}>
                  <a className="journal-entry__title" href={`/journal/${post.slug}`}>{post.title}</a>
                  <p className="journal-entry__meta">
                    <time dateTime={formatIsoDate(post.date)}>{formatMediumDate(post.date)}</time>
                    <span className="meta-sep">-</span> {post.readingTime} min read
                    {post.tags.length ? (
                      <>
                        <span className="meta-sep">-</span>{' '}
                        {post.tags.map((t) => (
                          <a className="tag" href={`/tags/${slugifyTag(t)}`} key={t}>{t}</a>
                        ))}
                      </>
                    ) : null}
                  </p>
                  {post.summary ? <p className="journal-entry__summary">{post.summary}</p> : null}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
