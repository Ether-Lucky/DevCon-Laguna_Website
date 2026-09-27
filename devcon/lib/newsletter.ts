/**
 * Newsletter sign-up (NEWS-01), shared by the form and the API route.
 *
 * The list lives in the DevConnect Portal. The form stays hidden until the
 * portal's endpoint is live and `NEWSLETTER_ENABLED=true` is set, so visitors
 * never meet a form that cannot work.
 */

/** Shown under the field, and sent to the portal as the record of what was agreed to. */
export const NEWSLETTER_CONSENT =
  'We’ll email you about DevCon Laguna events and news. Unsubscribe any time. See our Privacy Policy.';

export function isNewsletterEnabled(): boolean {
  return process.env.NEWSLETTER_ENABLED === 'true' && Boolean(process.env.PORTAL_API_KEY);
}
