"use client";

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { validateEmailAddress } from '@/lib/contact-schema';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Newsletter sign-up (NEWS-01). Rendered only when the portal's list is live;
 * see `lib/newsletter.ts`.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = validateEmailAddress(email);
    if (invalid) {
      setStatus('error');
      setMessage(invalid);
      return;
    }

    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (response.ok) {
        setStatus('sent');
        setMessage('Almost done: check your inbox to confirm your subscription.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'We could not sign you up just now. Please try again shortly.');
      }
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="newsletter-heading" data-testid="newsletter-form">
      <p id="newsletter-heading" className="font-semibold text-foreground">
        Get event updates
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          aria-invalid={status === 'error' || undefined}
          aria-describedby="newsletter-consent newsletter-status"
          className="min-w-0 flex-1 rounded-md border border-foreground/30 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
        />
        {/* Honeypot: hidden from people and assistive technology alike. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === 'sending' ? 'Signing up…' : 'Subscribe'}
        </button>
      </div>
      <p id="newsletter-consent" className="mt-2 text-xs text-foreground">
        We’ll email you about DevCon Laguna events and news. Unsubscribe any time. See our{' '}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        data-testid="newsletter-status"
        className="mt-2 min-h-5 text-sm font-medium text-foreground"
      >
        {status === 'sent' || status === 'error' ? message : ''}
      </p>
    </form>
  );
}
