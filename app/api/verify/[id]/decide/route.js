import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, isValidAdminCookieValue } from '@/lib/adminSession';
import { decideEntry } from '@/lib/guestbook';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

export async function POST(request, { params }) {
  const ip = getClientIp(request);
  if (isRateLimited(`verify-decide:${ip}`, { max: 60, windowMs: 5 * 60 * 1000 })) {
    return NextResponse.json({ error: 'Too many requests. Slow down.' }, { status: 429 });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidAdminCookieValue(session)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (body.decision !== 'approve' && body.decision !== 'reject') {
    return NextResponse.json({ error: 'Invalid decision.' }, { status: 400 });
  }

  try {
    await decideEntry(id, body.decision);
  } catch (err) {
    console.error('decideEntry failed', err);
    return NextResponse.json({ error: 'Invalid entry id.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
