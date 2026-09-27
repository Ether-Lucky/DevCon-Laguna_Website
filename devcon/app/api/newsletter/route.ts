import { NextResponse } from 'next/server';
import { validateEmailAddress } from '@/lib/contact-schema';
import { NEWSLETTER_CONSENT, isNewsletterEnabled } from '@/lib/newsletter';
import { subscribeToNewsletter } from '@/lib/portal/client';

/**
 * Newsletter sign-up endpoint (NEWS-01).
 *
 * Relays the address to the DevConnect Portal, which owns the list. This route
 * exists so the portal's API key stays on the server.
 *
 *   NEWSLETTER_ENABLED  "true" once the portal's endpoint is live
 *   PORTAL_API_KEY      the same key the landing content uses
 */
export async function POST(request: Request) {
  if (!isNewsletterEnabled()) {
    return NextResponse.json({ error: 'Newsletter sign-up is not open yet.' }, { status: 503 });
  }

  let body: { email?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot, as on the contact form: answer like a success, relay nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const invalid = validateEmailAddress(email);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const result = await subscribeToNewsletter(email, NEWSLETTER_CONSENT);
  switch (result.status) {
    case 'subscribed':
      return NextResponse.json({ ok: true });
    case 'invalid':
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    case 'rate-limited':
      return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 });
    default:
      console.error('[newsletter] portal subscribe failed:', result.reason);
      return NextResponse.json(
        { error: 'We could not sign you up just now. Please try again shortly.' },
        { status: 502 },
      );
  }
}
