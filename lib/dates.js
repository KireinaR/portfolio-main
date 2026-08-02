const ZONE = 'Asia/Kolkata';

// "Wednesday, 15 July 2026" — post masthead dateline
export function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// "15 July 2026" — journal list entry meta
export function formatMediumDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// "15 Jul 2026" — JSON feed
export function formatShortDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// ISO date (YYYY-MM-DD) for the <time datetime> attribute, in the site's zone
export function formatIsoDate(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

// RFC 822 date for RSS <pubDate>
export function formatRfc822(date) {
  return date.toUTCString();
}
