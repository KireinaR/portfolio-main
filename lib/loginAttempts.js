import { getDb } from '@/lib/db';

const COLLECTION = 'adminLoginAttempts';
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

// Backed by Mongo (not in-memory) so the limit holds across separate
// serverless function instances, not just one warm lambda.
export async function isLoginRateLimited(ip) {
  const db = await getDb();
  const since = new Date(Date.now() - WINDOW_MS);
  const count = await db.collection(COLLECTION).countDocuments({ ip, at: { $gte: since } });
  return count >= MAX_ATTEMPTS;
}

// Only failed attempts count against the limit.
export async function recordFailedLogin(ip) {
  const db = await getDb();
  await db.collection(COLLECTION).insertOne({ ip, at: new Date() });
}
