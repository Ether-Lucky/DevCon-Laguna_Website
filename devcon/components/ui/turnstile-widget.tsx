"use client";

import { useEffect, useRef } from 'react';

/** The action name this widget is issued for; the server checks it matches. */
export const TURNSTILE_ACTION = 'contact';

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      theme?: 'auto' | 'light' | 'dark';
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SCRIPT_ID = 'cf-turnstile-script';

/** Loads the Turnstile script once, no matter how many widgets mount. */
function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('turnstile script failed')));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('turnstile script failed'));
    document.head.appendChild(script);
  });
}

type TurnstileWidgetProps = {
  siteKey: string;
  /** Receives the token, or null when it expires or errors and must be re-solved. */
  onToken: (token: string | null) => void;
  /** Set to a new value to force a reset after a submission attempt. */
  resetSignal?: number;
};

/**
 * TurnstileWidget — renders the Cloudflare Turnstile challenge (CON-02).
 *
 * Rendered **explicitly** rather than via the auto-injected `.cf-turnstile` class,
 * because this form stays on the page after submitting. Turnstile tokens are
 * single-use: once redeemed at siteverify, the same token cannot be sent again.
 * Holding the widget id lets the form reset it so a second attempt gets a fresh
 * token instead of silently failing verification.
 *
 * The token is only ever sent to our own endpoint. Verification happens
 * server-side — a browser must never call siteverify, since that would expose the
 * secret.
 */
export default function TurnstileWidget({ siteKey, onToken, resetSignal = 0 }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  // Kept in a ref so the render effect below does not re-run (and re-render the
  // widget) every time the parent passes a new callback identity.
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !window.turnstile || widgetIdRef.current) return;
        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: siteKey,
          action: TURNSTILE_ACTION,
          theme: 'auto',
          callback: (token) => onTokenRef.current(token),
          // A stale token is worse than none: clear it so submission is blocked
          // until the visitor solves the challenge again.
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        });
      })
      .catch(() => {
        // Script blocked or offline. The form reports the missing token rather
        // than failing silently.
        onTokenRef.current(null);
      });

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetSignal === 0) return;
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
      onTokenRef.current(null);
    }
  }, [resetSignal]);

  return <div ref={containerRef} data-testid="turnstile-widget" className="mb-5" />;
}
