import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createEntry, getRateLimitRemaining, MESSAGE_MAX_LENGTH } from '@/lib/guestbook';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

export async function POST(request) {
  // Coarse per-IP throttle in front of everything else — the real limit is
  // the per-user, Mongo-backed one below; this just caps request volume from
  // a single source regardless of sign-in state.
  const ip = getClientIp(request);
  if (isRateLimited(`guestbook:${ip}`, { max: 20, windowMs: 5 * 60 * 1000 })) {
    return NextResponse.json({ error: 'Too many requests. Slow down.' }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.uid) {
    return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
  }
  if (message.length > MESSAGE_MAX_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  const remaining = await getRateLimitRemaining(session.user.uid);
  if (remaining > 0) {
    return NextResponse.json(
      { error: 'You can only post once every 10 minutes.', retryAfterMs: remaining },
      { status: 429 }
    );
  }

  const entry = await createEntry({
    uid: session.user.uid,
    provider: session.user.provider,
    name: session.user.name || 'Anonymous',
    image: session.user.image,
    message,
  });

  return NextResponse.json({ entry }, { status: 201 });
}
