import { formatShortDate } from '@/lib/dates';

const PROVIDER_LABEL = { github: 'GitHub', google: 'Google' };

function initials(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

// Small deterministic hash (not random) so a card's vertical nudge is stable
// across renders/reloads, but still varies card-to-card — chaotic to look
// at, systematic underneath.
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function GuestbookWall({ entries }) {
  if (!entries.length) {
    return <p className="guestbook-wall__empty">No notes yet. Be the first to sign in.</p>;
  }

  return (
    <ul className="guestbook-wall">
      {entries.map((entry) => {
        const providerLabel = PROVIDER_LABEL[entry.provider] || entry.provider;
        const date = formatShortDate(new Date(entry.createdAt));
        const nudge = (hash(entry.id) % 13) - 6; // -6px .. 6px

        return (
          <li className="guestbook-card" key={entry.id} style={{ '--nudge': `${nudge}px` }}>
            <div className="guestbook-card__who">
              {entry.image ? (
                <img
                  className="guestbook-card__avatar"
                  src={entry.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <span className="guestbook-card__avatar guestbook-card__avatar--fallback" aria-hidden="true">
                  {initials(entry.name)}
                </span>
              )}
              <span className="guestbook-card__byline">
                <span className="guestbook-card__name">
                  {entry.name}
                  {entry.username ? (
                    <span className="guestbook-card__username">({entry.username})</span>
                  ) : null}
                </span>{' '}
                <span className="guestbook-card__meta">
                  [{date} {providerLabel}]
                </span>
              </span>
            </div>
            <p className="guestbook-card__message">{entry.message}</p>
          </li>
        );
      })}
    </ul>
  );
}
