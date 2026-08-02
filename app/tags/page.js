import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllTags } from '@/lib/posts';

export const metadata = {
  title: 'Tags - Ujaan Mukherjee',
  description: 'Journal: writing by Ujaan Mukherjee.',
};

export default async function TagsPage() {
  const tags = await getAllTags();

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
          <h1 className="nameplate nameplate--page">Tags</h1>
        </div>

        <div className="wrap">
          <hr className="rule-double" />
          <section className="reveal">
            <p className="section-title">Topics</p>
            <ul className="tag-cloud">
              {tags.map(({ tag, tagSlug, posts }) => (
                <li key={tagSlug}>
                  <a className="tag" href={`/tags/${tagSlug}`}>{tag}</a>{' '}
                  <span className="tag-cloud__n">{posts.length}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
