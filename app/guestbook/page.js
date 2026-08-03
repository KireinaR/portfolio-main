import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GuestbookForm from '@/components/GuestbookForm';
import GuestbookWall from '@/components/GuestbookWall';
import { auth } from '@/auth';
import { getApprovedEntries, getRateLimitRemaining } from '@/lib/guestbook';
import { signInGithub, signInGoogle, signOutAction } from './actions';

export const metadata = {
  title: 'Guestbook - Ujaan Mukherjee',
  description: 'Notes from people who stopped by. Sign in with GitHub or Google to leave one.',
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.9 5.1 29.7 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.8 1.1 8 3l6-6C34.9 5.1 29.7 3 24 3 16.3 3 9.7 7.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 45c5.2 0 9.9-1.7 13.5-4.7l-6.2-5.2C29.3 36.9 26.8 38 24 38c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.6 40.7 16.3 45 24 45z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.2 5.2C40.3 36 44 30.5 44 24c0-1.4-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export default async function GuestbookPage() {
  const session = await auth();

  let entries = [];
  let remainingMs = 0;
  let dbError = false;
  try {
    entries = shuffle(await getApprovedEntries());
    if (session?.user?.uid) {
      remainingMs = await getRateLimitRemaining(session.user.uid);
    }
  } catch (err) {
    console.error('Guestbook data unavailable', err);
    dbError = true;
  }

  return (
    <>
      <Header active="guestbook" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span className="js-date">Est. MMXXVI</span>
            <span>Kolkata, India</span>
          </div>
          <h1 className="nameplate nameplate--page nameplate--compact">Guestbook</h1>
          <p className="subplate">
            <span>Notes from people who stopped by. Write anything you feel. (just don't swear.)</span>
          </p>
        </div>

        <div className="wrap">
          <section className="reveal guestbook">
            {dbError ? (
              <p className="guestbook-wall__empty">The guestbook is temporarily unavailable.</p>
            ) : (
              <>
                <div className="guestbook-auth">
                  {session ? (
                    <>
                      <GuestbookForm initialRemainingMs={remainingMs} />
                      <form action={signOutAction} className="guestbook-signout">
                        <span>Signed in as {session.user.name}</span>
                        <button type="submit">Sign out</button>
                      </form>
                    </>
                  ) : (
                    <div className="guestbook-signin">
                      <p>Sign in to leave a note</p>
                      <div className="guestbook-signin__buttons">
                        <form action={signInGithub}>
                          <button type="submit" className="guestbook-signin__button">
                            <GithubIcon />
                            GitHub
                          </button>
                        </form>
                        <form action={signInGoogle}>
                          <button type="submit" className="guestbook-signin__button">
                            <GoogleIcon />
                            Google
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                <GuestbookWall entries={entries} />
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
