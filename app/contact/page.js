import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CopyEmailButton from '@/components/CopyEmailButton';
import { getGithubProfile } from '@/lib/github';

export const metadata = {
  title: 'Contact - Ujaan Mukherjee',
  description: 'Get in touch with Ujaan Mukherjee: email, GitHub, LinkedIn.',
};

const EMAIL = 'hello@ujaanmukherjee.com';
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
          <p className="subplate">
            <span>Reach out</span>
          </p>
        </div>

        <div className="wrap">
          <section className="reveal">
            <ul className="contact-cards">
              <li className="contact-card">
                <p className="contact-card__kicker">Email</p>
                <p className="contact-card__title">{EMAIL}</p>
                <CopyEmailButton email={EMAIL} />
              </li>

              <li className="contact-card">
                <p className="contact-card__kicker">GitHub</p>
                <div className="contact-card__who">
                  {github?.avatarUrl ? (
                    <img
                      className="contact-card__avatar"
                      src={github.avatarUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="contact-card__avatar contact-card__avatar--fallback" aria-hidden="true">
                      {initials(GITHUB_USERNAME)}
                    </span>
                  )}
                  <div>
                    <p className="contact-card__title">{github?.name || GITHUB_USERNAME}</p>
                    <p className="contact-card__desc">@{GITHUB_USERNAME}</p>
                  </div>
                </div>
                {github?.bio ? <p className="contact-card__desc">{github.bio}</p> : null}
                <a
                  className="contact-card__link"
                  href={github?.htmlUrl || `https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener"
                >
                  View profile
                </a>
              </li>

              <li className="contact-card">
                <p className="contact-card__kicker">LinkedIn</p>
                <p className="contact-card__title">Ujaan Mukherjee</p>
                <p className="contact-card__desc">Computer Science undergraduate</p>
                <a className="contact-card__link" href={LINKEDIN_URL} target="_blank" rel="noopener">
                  View profile
                </a>
              </li>
            </ul>

            <p className="resume-link">
              Follow my <a href="/journal/index.xml">RSS</a> feed.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
