import { formatShortDate } from '@/lib/dates';

function initials(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

export default function GuestbookWall({ entries }) {
  if (!entries.length) {
    return <p className="guestbook-wall__empty">No notes yet. Be the first to sign in.</p>;
  }

  return (
    <ul className="guestbook-wall">
      {entries.map((entry) => (
        <li className="guestbook-card" key={entry.id}>
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
          <div className="guestbook-card__body">
            <p className="guestbook-card__message">
              <span className="guestbook-card__name">{entry.name}</span> {entry.message}
            </p>
            <p className="guestbook-card__meta">
              {formatShortDate(new Date(entry.createdAt))}
              <span className="guestbook-card__provider"> &middot; {entry.provider}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
