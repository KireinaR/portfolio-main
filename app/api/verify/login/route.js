import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE_SECONDS,
  createAdminCookieValue,
  isCorrectPassword,
} from '@/lib/adminSession';
import { getClientIp } from '@/lib/rateLimit';
import { isLoginRateLimited, recordFailedLogin } from '@/lib/loginAttempts';

export async function POST(request) {
  const ip = getClientIp(request);

  let limited;
  try {
    limited = await isLoginRateLimited(ip);
  } catch (err) {
    console.error('Login rate-limit check failed', err);
    return NextResponse.json({ error: 'Try again shortly.' }, { status: 503 });
  }
  if (limited) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));

  if (!isCorrectPassword(body.password)) {
    await recordFailedLogin(ip).catch((err) => console.error('Failed to record login attempt', err));
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createAdminCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
