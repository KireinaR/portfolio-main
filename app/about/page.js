import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PdfViewer from '@/components/PdfViewer';

export const metadata = {
  title: 'The Author - Ujaan Mukherjee',
  description: 'Ujaan Mukherjee: what he studies, and his résumé.',
};

export default function AboutPage() {
  return (
    <>
      <Header active="about" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span className="js-date">Est. MMXXVI</span>
            <span>Kolkata, India</span>
          </div>
          <h1 className="nameplate nameplate--page">The Author</h1>
          <p className="subplate">
            <span>Ujaan Mukherjee</span>
          </p>
        </div>

        <div className="wrap">
          <section className="pagehead reveal">
            <p className="standfirst">
              Pursuing a Bachelor of Technology in Computer Science.
            </p>
          </section>

          <section className="reveal" aria-label="Experience">
            <p className="section-title">Experience</p>
            <ul className="schools">
              <li className="school">
                <span className="school__logo">
                  <img src="/agenscience-logo.jpg" alt="Agenscience.ai logo" />
                </span>
                <div className="school__body">
                  <p className="school__name">Intern, Agenscience.ai</p>
                  <p className="school__meta">
                    Designed AI-powered prototypes and multi-agent LLM pipelines for Agenscience&#39;s
                    decision-intelligence platform, running the full ML lifecycle on client datasets.
                  </p>
                  <p className="school__years">June 2026 &ndash; August 2026 &middot; Boston, United States of America</p>
                </div>
              </li>
            </ul>
          </section>

          <section className="reveal" aria-label="Education">
            <p className="section-title">Education</p>
            <ul className="schools">
              <li className="school">
                <span className="school__logo">
                  <img src="/iem.png" alt="Institute of Engineering and Management, Kolkata logo" />
                </span>
                <div className="school__body">
                  <p className="school__name">Institute of Engineering and Management, Kolkata</p>
                  <p className="school__meta">Bachelor of Technology, Computer Science (in progress)</p>
                </div>
              </li>
              <li className="school">
                <span className="school__logo">
                  <img src="/dbl.png" alt="Don Bosco School, Liluah logo" />
                </span>
                <div className="school__body">
                  <p className="school__name">Don Bosco School, Liluah</p>
                  <p className="school__meta">Secondary &amp; higher secondary schooling</p>
                  <p className="school__years">2012 &ndash; 2025</p>
                </div>
              </li>
            </ul>
          </section>

          <section className="reveal" aria-label="Resume">
            <p className="section-title">R&eacute;sum&eacute;</p>
            <div className="resume-wrap resume-wrap--inline">
              <PdfViewer src="/resume.pdf" fileName="Ujaan Mukherjee - Resume.pdf" />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
