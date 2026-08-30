import { track } from '@vercel/analytics';

/**
 * Analytics event names (ANL-01).
 *
 * Kept in one place so a typo cannot silently create a second, near-identical
 * event that quietly splits a metric in the dashboard.
 */
export const ANALYTICS_EVENTS = {
  ctaClick: 'cta_click',
  contactSubmitted: 'contact_submitted',
} as const;

/**
 * Reports an event, never letting analytics break the page.
 *
 * Collection only happens on Vercel deployments; locally and in tests `track` is
 * a no-op. The try/catch is belt-and-braces: a blocked script or an ad blocker
 * must not take a form submission down with it.
 */
export function trackEvent(name: string, properties?: Record<string, string>): void {
  try {
    track(name, properties);
  } catch {
    // Analytics is never important enough to surface an error to the user.
  }
}
