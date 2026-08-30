import { NextResponse } from 'next/server';
import { validateContact, type ContactPayload } from '@/lib/contact-schema';
import { siteConfig } from '@/lib/site-config';

/**
 * Contact form submission endpoint (CON-01).
 *
 * Delivery uses Resend over plain HTTP rather than its SDK, to avoid adding a
 * dependency for one request. Configure with environment variables — never commit
 * credentials:
 *
 *   RESEND_API_KEY    server-side API key
 *   CONTACT_TO_EMAIL  destination inbox (defaults to siteConfig.email)
 *   CONTACT_FROM_EMAIL sender on a Resend-verified domain
 *
 * Until RESEND_API_KEY is set the endpoint validates input and returns 503 with a
 * clear message, so the form is testable end-to-end and fails honestly rather than
 * pretending to have sent something.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** Escapes text before it is placed into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  let body: Partial<ContactPayload> & { website?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot (CON-02): a real user never fills a field they cannot see. Answer 200
  // so a bot cannot tell it was rejected, but send nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const name = body.name!.trim();
  const email = body.email!.trim();
  const subject = body.subject!.trim();
  const message = body.message!.trim();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Configuration gap, not user error — say so plainly instead of a fake success.
    console.error('[contact] RESEND_API_KEY is not set; cannot deliver message.');
    return NextResponse.json(
      { error: 'The contact form is not configured yet. Please email us directly.' },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? `DevCon Laguna <onboarding@resend.dev>`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Website] ${subject}`,
        html: `
          <h2>New message from the DevCon Laguna website</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
        `,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[contact] Resend rejected the message:', response.status, detail);
      return NextResponse.json(
        { error: 'We could not send your message. Please try again shortly.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] Delivery failed:', error);
    return NextResponse.json(
      { error: 'We could not send your message. Please try again shortly.' },
      { status: 502 },
    );
  }
}
