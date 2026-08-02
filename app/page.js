import fs from 'node:fs';
import path from 'node:path';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Ujaan Mukherjee',
  description: 'Ujaan Mukherjee. Computer science undergraduate who builds software and studies the algorithms underneath it.',
  openGraph: {
    type: 'website',
    title: 'Ujaan Mukherjee',
    description: 'Computer science undergraduate. Software, and the algorithms underneath it.',
  },
};

const asciiWandererHtml = fs.readFileSync(
  path.join(process.cwd(), 'lib', 'ascii-wanderer-fragment.html'),
  'utf8'
);

export default function HomePage() {
  return (
    <>
      <Header active="home" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span className="js-date">Est. MMXXVI</span>
            <span>Kolkata, India</span>
          </div>
          <h1 className="nameplate nameplate--home">Ujaan Mukherjee</h1>
        </div>

        <div className="wrap front">
          <article className="front__lead reveal">
            <p className="kicker">From the desk of the author</p>
            <p className="standfirst">
              Computer science undergraduate. I build software, and study the
              algorithms underneath it.
            </p>
            <p className="quote-line">
              &ldquo;Amaze. Amaze. Amaze.&rdquo;
              <cite>Rocky, from <em>Project Hail Mary</em> by Andy Weir</cite>
            </p>

            <figure
              className="ascii-plate"
              role="img"
              aria-label="ASCII rendering of Caspar David Friedrich&#39;s painting Wanderer above the Sea of Fog: a lone figure on a crag overlooking fog."
            >
              <pre
                className="ascii"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: asciiWandererHtml }}
              />
              <figcaption>
                Wanderer above the Sea of Fog, after Caspar David Friedrich (1818).
                Rendered in ASCII.
              </figcaption>
            </figure>
            <p className="plate-note">I just really like this picture.</p>
          </article>

          <aside className="front__aside reveal">
            <nav className="edition" aria-label="Journal Entries">
              <p className="edition__title">Journal Entries</p>
              <ul className="index-list" id="journal-entries">
                <li>
                  <a href="/journal">
                    <span className="name">Browse the Journal</span>
                  </a>
                </li>
              </ul>
              <p className="edition__rss">
                <a className="rss-badge" href="/journal/index.xml">
                  <span className="rss-badge__dot" aria-hidden="true"></span>RSS
                </a>
              </p>
            </nav>
          </aside>
        </div>
      </main>

      <Footer home />
    </>
  );
}
