import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, isValidAdminCookieValue } from '@/lib/adminSession';
import { deleteEntryById } from '@/lib/guestbook';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

export async function DELETE(request, { params }) {
  const ip = getClientIp(request);
  if (isRateLimited(`verify-delete:${ip}`, { max: 60, windowMs: 5 * 60 * 1000 })) {
    return NextResponse.json({ error: 'Too many requests. Slow down.' }, { status: 429 });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidAdminCookieValue(session)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteEntryById(id);
  } catch (err) {
    console.error('deleteEntryById failed', err);
    return NextResponse.json({ error: 'Invalid entry id.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
