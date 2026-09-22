/**
 * Whether this build should load Vercel Web Analytics (ANL-01-BT-01).
 *
 * `<Analytics />` requests `/_vercel/insights/script.js`, a path that only
 * exists on a Vercel deployment. Everywhere else, CI and local builds included,
 * it answered 404 and logged a console error on every page load. That cost
 * Lighthouse's Best Practices audit, and worse, it meant a real console error
 * always arrived next to one that was expected and easy to ignore.
 *
 * Vercel sets `VERCEL=1` on every build and runtime it hosts, production and
 * preview alike, so analytics keeps working exactly where it can.
 *
 * Takes the environment as a parameter so the rule can be tested directly.
 */
export function shouldLoadAnalytics(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.VERCEL);
}
