import { formatShortDate } from '@/lib/dates';

const PROVIDER_LABEL = { github: 'GitHub', google: 'Google' };
const ALIGN = ['flex-start', 'center', 'flex-end'];

function initials(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

// Small deterministic hash (not random) so a card's placement/treatment is
// stable across renders/reloads and independent of the shuffled display
// order - chaotic to look at, systematic underneath.
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
        const h = hash(entry.id);
        const align = ALIGN[h % ALIGN.length];
        const classes = ['guestbook-card'];
        if (h % 2 === 0) classes.push('guestbook-card--alt');
        if (h % 4 === 0) classes.push('guestbook-card--featured');

        return (
          <li className={classes.join(' ')} key={entry.id} style={{ alignSelf: align }}>
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
                  [{date} <span className="guestbook-card__provider">{providerLabel}</span>]
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
