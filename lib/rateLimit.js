// Lightweight in-memory per-IP throttle. Resets on cold start / redeploy and
// isn't shared across concurrent serverless instances - that's fine here,
// it's a coarse defense-in-depth layer sitting in front of checks (auth,
// the Mongo-backed per-user limit, the Mongo-backed login-attempt limit)
// that don't have that weakness.
const buckets = new Map();

export function isRateLimited(key, { max, windowMs }) {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= max) {
    buckets.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  buckets.set(key, timestamps);
  return false;
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
