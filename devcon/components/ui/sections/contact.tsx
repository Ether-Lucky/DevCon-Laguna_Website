"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { validateContact, type ContactErrors, type ContactPayload } from '@/lib/contact-schema';
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics';
import TurnstileWidget from '@/components/ui/turnstile-widget';
import SocialMedia from '@/components/ui/sections/social-media';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY: ContactPayload = { name: '', email: '', subject: '', message: '' };

/** Real, staffed channel shown in place of an email address. */
const FACEBOOK_PAGE = 'https://www.facebook.com/DEVCONLAGUNA';

const FIELD_CLASS =
  'w-full rounded-md border bg-background/60 px-4 py-3 font-mono text-sm text-foreground ' +
  'placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-2 ' +
  'focus:ring-devcon-lime-500/60';

/** Monospace field label, matching the approved design. */
function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-muted"
    >
      {children}
    </label>
  );
}

/**
 * Contact — the "Get in touch" section and its form (CON-01, closes FR-07).
 *
 * Validation runs on the client for fast feedback and again on the server, using the
 * same rules from `lib/contact-schema` so the two cannot drift apart.
 *
 * On failure the user's input is deliberately preserved — losing a long message to a
 * network error is the worst outcome here.
 */
export default function Contact() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // Bumped after every attempt: Turnstile tokens are single-use, so the widget
  // must be reset before the visitor can try again.
  const [resetSignal, setResetSignal] = useState(0);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const update =
    (field: keyof ContactPayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      // Clear a field's error as soon as the user starts correcting it.
      setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
    };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const found = validateContact(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus('error');
      return;
    }

    setErrors({});
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          // `website` is the honeypot; a real user leaves it empty.
          website: '',
          // Verified server-side; the browser never calls siteverify itself.
          'cf-turnstile-response': turnstileToken ?? '',
        }),
      });
      // The token has now been spent whatever the outcome, so force a fresh one.
      setResetSignal((n) => n + 1);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setFormError(data.error ?? 'Please check the highlighted fields and try again.');
        setStatus('error');
        return;
      }

      setValues(EMPTY);
      setStatus('sent');
      // Reported only on a confirmed send, so the metric counts real enquiries
      // rather than submit attempts (ANL-01).
      trackEvent(ANALYTICS_EVENTS.contactSubmitted);
    } catch {
      setFormError('We could not reach the server. Please try again shortly.');
      setStatus('error');
    }
  }

  const borderFor = (field: keyof ContactPayload) =>
    errors[field]
      ? 'border-devcon-orange-500 focus:ring-devcon-orange-500/60'
      : 'border-foreground/15 hover:border-foreground/25';

  // `scroll-mt-28` keeps the section heading clear of the sticky nav when the
  // "Contact" link jumps here; without it the first line lands underneath it.
  return (
    <section
      id="contact"
      className="w-full max-w-7xl mx-auto scroll-mt-28 px-4 md:px-8 py-16 md:py-24"
    >
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-devcon-lime-500">
        {'// Get in touch with the community'}
      </p>
      <h2 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
        Get in <span className="text-devcon-purple-500">Touch.</span>
      </h2>
      <p className="mt-6 max-w-2xl text-base text-muted">
        Have questions about the upcoming DevCon? Want to speak, sponsor, or volunteer? Drop us a
        line and our core team will reach back out.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact details */}
        <div className="flex flex-col gap-8">
          {/*
            No email address is shown: DevCon Laguna does not own a domain, so any
            address here would be unreachable. The Facebook page is a real, staffed
            channel and is the direct alternative to the form (CON-01-BT-01).
          */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {'// Message us directly'}
            </p>
            <a
              href={FACEBOOK_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-lg font-semibold text-foreground underline-offset-4 hover:underline"
            >
              facebook.com/DEVCONLAGUNA
            </a>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {'// Community hub'}
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">Laguna, Philippines</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {'// Network signals'}
            </p>
            <div className="mt-3">
              <SocialMedia />
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
          {/* Honeypot: hidden from users, tempting to bots. */}
          <div aria-hidden="true" className="hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="mb-5">
            <Label htmlFor="name">Full name</Label>
            <input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={update('name')}
              autoComplete="name"
              placeholder="Juan Dela Cruz"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={`${FIELD_CLASS} ${borderFor('name')}`}
            />
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="mt-2 font-mono text-xs text-devcon-orange-500"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="mb-5">
            <Label htmlFor="email">Email address</Label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={update('email')}
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`${FIELD_CLASS} ${borderFor('email')}`}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-2 font-mono text-xs text-devcon-orange-500"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-5">
            <Label htmlFor="subject">Subject / topic</Label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={values.subject}
              onChange={update('subject')}
              placeholder="What are we talking about?"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              className={`${FIELD_CLASS} ${borderFor('subject')}`}
            />
            {errors.subject && (
              <p
                id="subject-error"
                role="alert"
                className="mt-2 font-mono text-xs text-devcon-orange-500"
              >
                {errors.subject}
              </p>
            )}
          </div>

          <div className="mb-6">
            <Label htmlFor="message">Your message</Label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={values.message}
              onChange={update('message')}
              placeholder="Tell us details about your speaking proposal, sponsor interests, or community inquiries..."
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={`${FIELD_CLASS} resize-y ${borderFor('message')}`}
            />
            {errors.message && (
              <p
                id="message-error"
                role="alert"
                className="mt-2 font-mono text-xs text-devcon-orange-500"
              >
                {errors.message}
              </p>
            )}
          </div>

          {turnstileSiteKey && (
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onToken={setTurnstileToken}
              resetSignal={resetSignal}
            />
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-full bg-devcon-lime-500 px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.14em] text-devcon-black-500 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {/* Status is announced to assistive tech as it changes. */}
          <div aria-live="polite" className="mt-4">
            {status === 'sent' && (
              <p
                data-testid="contact-success"
                className="rounded-md border border-devcon-lime-500/50 bg-devcon-lime-500/10 px-4 py-3 font-mono text-sm text-foreground"
              >
                Your message has been sent successfully.
              </p>
            )}
            {formError && (
              <p
                data-testid="contact-error"
                className="rounded-md border border-devcon-orange-500/50 bg-devcon-orange-500/10 px-4 py-3 font-mono text-sm text-foreground"
              >
                {formError}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
