import { MongoClient } from 'mongodb';

// Cached on `global` so dev-mode hot reloads (and warm serverless
// invocations) reuse one connection instead of opening a new one per request.
// Lazily created (not at module load) so `next build` doesn't crash before
// MONGODB_URI is configured.
function getClientPromise() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to .env.local (see .env.example).');
  }
  if (!global._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  // The connection string has no database path segment, so name it
  // explicitly rather than relying on the driver's (absent) default.
  return client.db('guestbook');
}
