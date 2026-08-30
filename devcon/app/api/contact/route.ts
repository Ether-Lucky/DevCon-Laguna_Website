import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { validateContact, type ContactPayload } from '@/lib/contact-schema';

/**
 * Contact form submission endpoint (CON-01, CON-01-BT-01).
 *
 * Delivery goes through Gmail SMTP with an app password. DevCon Laguna does not
 * own a domain — the site is served from a Vercel subdomain — so providers that
 * require a verified sending domain (Resend, Postmark, SES) cannot be used.
 *
 * Configure with environment variables; never commit credentials:
 *
 *   GMAIL_USER          the Gmail address messages are sent from
 *   GMAIL_APP_PASSWORD  16-character app password (needs 2-Step Verification)
 *   CONTACT_TO_EMAIL    destination inbox; defaults to GMAIL_USER
 *
 * With the credentials unset the endpoint validates input and returns 503 with a
 * clear message, so the form is testable end to end and fails honestly rather
 * than pretending to have sent something.
 */

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

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    // Configuration gap, not user error — say so plainly instead of a fake success.
    console.error('[contact] GMAIL_USER / GMAIL_APP_PASSWORD are not set; cannot deliver.');
    return NextResponse.json(
      { error: 'The contact form is not configured yet. Please reach us on social media.' },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? user;

  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    await transport.sendMail({
      from: `DevCon Laguna Website <${user}>`,
      to,
      // Replying goes to the visitor, not to the site's own mailbox.
      replyTo: `${name} <${email}>`,
      subject: `[Website] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: `
        <h2>New message from the DevCon Laguna website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] Delivery failed:', error);
    return NextResponse.json(
      { error: 'We could not send your message. Please try again shortly.' },
      { status: 502 },
    );
  }
}
