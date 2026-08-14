import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getGithubProfile } from '@/lib/github';

export const metadata = {
  title: 'Contact - Ujaan Mukherjee',
  description: 'Get in touch with Ujaan Mukherjee: email, GitHub, LinkedIn.',
};

const GITHUB_USERNAME = 'KireinaR';
const LINKEDIN_URL = 'https://www.linkedin.com/in/um007/';

function initials(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

export default async function ContactPage() {
  const github = await getGithubProfile(GITHUB_USERNAME);

  return (
    <>
      <Header active="contact" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span className="js-date">Est. MMXXVI</span>
            <span>Kolkata, India</span>
          </div>
          <h1 className="nameplate nameplate--page">Contact</h1>
        </div>

        <div className="wrap">
          <section className="reveal contact-layout">
            <ContactForm />

            <div>
              <div className="contact-social">
                <p className="contact-form__kicker">Elsewhere</p>

                <ul className="contact-strips">
                  <li className="contact-strip">
                    <a
                      href={github?.htmlUrl || `https://github.com/${GITHUB_USERNAME}`}
                      target="_blank"
                      rel="noopener"
                    >
                      {github?.avatarUrl ? (
                        <img
                          className="contact-strip__avatar"
                          src={github.avatarUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="contact-strip__avatar contact-strip__avatar--fallback" aria-hidden="true">
                          {initials(GITHUB_USERNAME)}
                        </span>
                      )}
                      <span className="contact-strip__body">
                        <span className="contact-strip__kicker">GitHub</span>
                        <span className="contact-strip__title-row">
                          <span className="contact-strip__title">{github?.name || GITHUB_USERNAME}</span>
                          <span className="contact-strip__desc">@{GITHUB_USERNAME}</span>
                        </span>
                      </span>
                    </a>
                  </li>

                  <li className="contact-strip">
                    <a href={LINKEDIN_URL} target="_blank" rel="noopener">
                      <span className="contact-strip__body">
                        <span className="contact-strip__kicker">LinkedIn</span>
                        <span className="contact-strip__title-row">
                          <span className="contact-strip__title">Ujaan Mukherjee</span>
                          <span className="contact-strip__desc">Computer Science undergraduate</span>
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <p className="resume-link">
                Follow my <a href="/journal/index.xml">RSS</a> feed.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
