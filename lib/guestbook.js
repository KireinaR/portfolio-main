import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';

const COLLECTION = 'guestbookEntries';
export const MESSAGE_MAX_LENGTH = 200;
export const RATE_LIMIT_MS = 10 * 60 * 1000; // 1 message / 10 minutes / user

async function collection() {
  const db = await getDb();
  return db.collection(COLLECTION);
}

// Deliberately omits `uid` (the "provider:providerAccountId" string) — that's
// an internal rate-limiting key, not something GitHub/Google account
// identifiers should ever reach the browser as.
function serialize(doc) {
  return {
    id: doc._id.toString(),
    provider: doc.provider,
    name: doc.name,
    username: doc.username || null,
    image: doc.image,
    message: doc.message,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  };
}

// Returns milliseconds remaining before this user may post again, or 0 if
// they're clear. Looks at the user's most recent entry regardless of its
// moderation status, since the limit is about posting frequency, not spam
// that got approved.
export async function getRateLimitRemaining(uid) {
  const col = await collection();
  const last = await col.findOne(
    { uid },
    { sort: { createdAt: -1 }, projection: { createdAt: 1 } }
  );
  if (!last) return 0;
  const elapsed = Date.now() - last.createdAt.getTime();
  return Math.max(0, RATE_LIMIT_MS - elapsed);
}

export async function createEntry({ uid, provider, name, username, image, message }) {
  const col = await collection();
  const doc = {
    uid,
    provider,
    name,
    username: username || null,
    image: image || null,
    message: message.slice(0, MESSAGE_MAX_LENGTH),
    status: 'pending',
    createdAt: new Date(),
  };
  const { insertedId } = await col.insertOne(doc);
  return serialize({ ...doc, _id: insertedId });
}

export async function getApprovedEntries() {
  const col = await collection();
  const docs = await col.find({ status: 'approved' }).sort({ createdAt: -1 }).toArray();
  return docs.map(serialize);
}

// For the /verify moderation page: every entry regardless of status,
// newest first.
export async function getAllEntries() {
  const col = await collection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(serialize);
}

export async function decideEntry(id, decision) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid entry id.');
  }
  const col = await collection();
  const status = decision === 'approve' ? 'approved' : 'rejected';
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { status, decidedAt: new Date() } });
}

export async function deleteEntryById(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid entry id.');
  }
  const col = await collection();
  await col.deleteOne({ _id: new ObjectId(id) });
}
