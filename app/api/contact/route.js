import { NextResponse } from 'next/server';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

const NAME_MAX = 100;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 200;
const SUBJECT_MAX = 120;
const EMAIL_MAX = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Reject newlines/control chars so nothing in these fields can smuggle extra
// headers or lines into the outgoing email.
const CONTROL_CHARS_RE = /[\r\n\x00-\x08\x0b\x0c\x0e-\x1f]/;

const TO_EMAIL =
  process.env.CONTACT_TO_EMAIL || 'hello@ujaanmukherjee.com';

// Notification sent to you
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || 'Portfolio <hello@ujaanmukherjee.com>';

// Confirmation sent back to the visitor
const CONFIRM_FROM_EMAIL =
  process.env.CONTACT_CONFIRM_FROM_EMAIL || "Ujaan's Mailbox <hello@ujaanmukherjee.com>";

const GITHUB_URL = 'https://github.com/KireinaR';
const LINKEDIN_URL = 'https://www.linkedin.com/in/um007/';

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

async function sendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Resend API error ${res.status}: ${await res.text()}`);
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (isRateLimited(`contact:${ip}`, { max: 3, windowMs: 15 * 60 * 1000 })) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  // Reject cross-site POSTs, this endpoint should only ever be called from
  // the site's own contact form.
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot field, hidden from real visitors via CSS, so anything that
  // fills it in is a bot. Return a fake success instead of a hint.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!fullName || fullName.length > NAME_MAX || CONTROL_CHARS_RE.test(fullName)) {
    return NextResponse.json({ error: `Full name must be 1-${NAME_MAX} characters.` }, { status: 400 });
  }
  if (!email || email.length > EMAIL_MAX || CONTROL_CHARS_RE.test(email) || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (!subject || subject.length > SUBJECT_MAX || CONTROL_CHARS_RE.test(subject)) {
    return NextResponse.json({ error: `Subject must be 1-${SUBJECT_MAX} characters.` }, { status: 400 });
  }
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    return NextResponse.json(
      { error: `Message must be ${MESSAGE_MIN}-${MESSAGE_MAX} characters.` },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set.');
    return NextResponse.json({ error: 'Contact form is temporarily unavailable.' }, { status: 500 });
  }

  try {
    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `[Portfolio contact] ${subject}`,
      html: `<p><strong>From:</strong> ${escapeHtml(fullName)} (${escapeHtml(email)})</p>` +
        `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` +
        `<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    });
  } catch (err) {
    console.error('[contact] Failed to send notification email', err);
    return NextResponse.json({ error: 'Could not send your message. Try again later.' }, { status: 502 });
  }

  // Best-effort confirmation reply to the sender. The message to Ujaan
  // already succeeded above, so a failure here shouldn't fail the request,
  // it just means the sender doesn't get the courtesy reply.
  try {
    await sendEmail(apiKey, {
      from: CONFIRM_FROM_EMAIL,
      to: email,
      subject: 'Message delivered. Ujaan will be in touch',
      html: `<p>Hi ${escapeHtml(fullName)},</p>` +
        `<p>Your message just landed safely in Ujaan Mukherjee's inbox. It has been read by a human ` +
        `(well, it will be shortly, he does eventually check these). He'll get back to you soon.</p>` +
        `<p>While you wait, here's where else to find him:</p>` +
        `<p>GitHub: <a href="${GITHUB_URL}">${GITHUB_URL}</a><br>` +
        `LinkedIn: <a href="${LINKEDIN_URL}">${LINKEDIN_URL}</a></p>` +
        `<p>Talk soon,<br>Ujaan's Mailbox</p>`,
    });
  } catch (err) {
    console.error('[contact] Failed to send confirmation email', err);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
