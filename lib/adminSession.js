import crypto from 'node:crypto';

export const ADMIN_COOKIE_NAME = 'admin_session';
const MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours
export const ADMIN_COOKIE_MAX_AGE_SECONDS = MAX_AGE_MS / 1000;

function sign(payload) {
  return crypto.createHmac('sha256', process.env.ADMIN_SECRET).update(payload).digest('hex');
}

function timingSafeStringsEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function isCorrectPassword(candidate) {
  if (!process.env.ADMIN_PASSWORD || typeof candidate !== 'string' || !candidate) return false;
  return timingSafeStringsEqual(candidate, process.env.ADMIN_PASSWORD);
}

// Stateless signed cookie: "<issuedAt>.<hmac(issuedAt)>". No session store
// needed — validity is just "signature checks out and isn't expired."
export function createAdminCookieValue() {
  const issuedAt = String(Date.now());
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isValidAdminCookieValue(value) {
  if (!value || !process.env.ADMIN_SECRET) return false;
  const [issuedAt, signature] = value.split('.');
  if (!issuedAt || !signature) return false;
  if (!timingSafeStringsEqual(signature, sign(issuedAt))) return false;
  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age < MAX_AGE_MS;
}
