import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerifyLogin from '@/components/VerifyLogin';
import VerifyQueue from '@/components/VerifyQueue';
import { ADMIN_COOKIE_NAME, isValidAdminCookieValue } from '@/lib/adminSession';
import { getPendingEntries } from '@/lib/guestbook';

export const metadata = {
  title: 'Verify - Ujaan Mukherjee',
  robots: { index: false, follow: false },
};

export default async function VerifyPage() {
  const cookieStore = await cookies();
  const authorized = isValidAdminCookieValue(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  let entries = [];
  let dbError = false;
  if (authorized) {
    try {
      entries = await getPendingEntries();
    } catch (err) {
      console.error('Verify queue unavailable', err);
      dbError = true;
    }
  }

  return (
    <>
      <Header active="verify" />

      <main id="top">
        <div className="wrap masthead">
          <div className="dateline">
            <span className="js-date">Est. MMXXVI</span>
            <span>Kolkata, India</span>
          </div>
          <h1 className="nameplate nameplate--page">Verify</h1>
        </div>

        <div className="wrap">
          <section className="reveal verify">
            {!authorized ? (
              <VerifyLogin />
            ) : dbError ? (
              <p className="verify-queue__empty">The moderation queue is temporarily unavailable.</p>
            ) : (
              <VerifyQueue initialEntries={entries} />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
