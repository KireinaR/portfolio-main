import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPosts, slugifyTag } from '@/lib/posts';
import { formatIsoDate, formatMediumDate } from '@/lib/dates';

export const metadata = {
  title: 'Journal - Ujaan Mukherjee',
  description: 'Writing by Ujaan Mukherjee: software, algorithms, and whatever else is on the desk.',
  alternates: {
    types: { 'application/rss+xml': '/journal/index.xml' },
  },
};

export default async function JournalPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Header active="journal" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span>Page IV</span>
            <span>JOURNAL</span>
            <span>
              <a className="rss-badge" href="/journal/index.xml">
                <span className="rss-badge__dot" aria-hidden="true"></span>RSS
              </a>
            </span>
          </div>
          <h1 className="nameplate nameplate--page">Journal</h1>
          <p className="subplate">
            <span>Notes from the workbench and the terminal</span>
          </p>
        </div>

        <div className="wrap">
          <section className="reveal">
            {posts.length ? (
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
                          {post.tags.map((tag) => (
                            <a className="tag" href={`/tags/${slugifyTag(tag)}`} key={tag}>{tag}</a>
                          ))}
                        </>
                      ) : null}
                    </p>
                    {post.summary ? <p className="journal-entry__summary">{post.summary}</p> : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="prose">No journal entries yet. Check back soon.</p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
