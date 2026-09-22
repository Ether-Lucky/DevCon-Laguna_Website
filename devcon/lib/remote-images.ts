/**
 * The remote image hosts this site will render — one list, used twice.
 *
 * `next.config.ts` passes it to `images.remotePatterns`, where it decides what
 * `next/image` will optimise. `lib/portal/content.ts` checks portal photos
 * against it before rendering, so a URL the optimiser would reject becomes a
 * missing photo instead of a broken image.
 *
 * Keeping both in one place is the point. If they were separate lists, adding
 * a host to one and not the other would reintroduce exactly the failure this
 * exists to prevent.
 *
 * Deliberately free of Next.js and server-only imports: the config file loads
 * it at build time, and the test suite imports it directly.
 */

type RemoteImagePattern = {
  protocol: 'https';
  hostname: string;
  /** A path prefix ending in `/**`, the only form this project uses. */
  pathname: `${string}/**`;
};

/**
 * Portal photos are Supabase Storage public URLs. Pinned to the portal's
 * current project rather than `**.supabase.co`: a wildcard would survive a
 * project migration, but it would also trust every Supabase project there is.
 */
export const remoteImagePatterns: RemoteImagePattern[] = [
  {
    protocol: 'https',
    hostname: 'vdqczedgmehendqqifgs.supabase.co',
    pathname: '/storage/v1/object/public/**',
  },
];

/**
 * True when `next/image` will accept this URL under `remoteImagePatterns`.
 *
 * Mirrors only the pattern forms defined above (exact hostname, `/**` path
 * prefix). Anything that does not parse as a URL is rejected rather than
 * guessed at.
 */
export function isAllowedRemoteImage(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  return remoteImagePatterns.some(
    (pattern) =>
      parsed.protocol === `${pattern.protocol}:` &&
      parsed.hostname === pattern.hostname &&
      // A non-default port is a different origin; the optimiser treats it so.
      parsed.port === '' &&
      parsed.pathname.startsWith(pattern.pathname.slice(0, -2)),
  );
}
