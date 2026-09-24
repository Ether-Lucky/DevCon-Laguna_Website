/**
 * posts.ts — the rules for showing a news post (NEWS-02).
 *
 * Free of `server-only`, like the other portal modules, so the rules can be
 * tested directly rather than only through a running page.
 */

import { EVENT_TIME_ZONE } from './format';
import type { PortalPost } from './types';

/** Where a post lives. The portal freezes the slug at publication. */
export function postPath(post: Pick<PortalPost, 'slug'>): string {
  return `/news/${encodeURIComponent(post.slug)}`;
}

/** How many posts the homepage shows. The portal sends exactly these three. */
export const HOMEPAGE_POSTS = 3;

/** Characters of the body used when a post has no excerpt of its own. */
const EXCERPT_LIMIT = 155;

/**
 * The post's own summary, or the opening of its body.
 *
 * The portal makes `excerpt` optional, so this is the difference between a card
 * with a sentence on it and a card with nothing. Whitespace and paragraph
 * breaks are collapsed: an excerpt is one line of text, wherever it came from.
 */
export function postExcerpt(post: Pick<PortalPost, 'excerpt' | 'body'>): string {
  const own = post.excerpt?.trim();
  if (own) return own;

  const opening = post.body.replace(/\s+/g, ' ').trim();
  if (opening.length <= EXCERPT_LIMIT) return opening;

  const cut = opening.slice(0, EXCERPT_LIMIT);
  const lastSpace = cut.lastIndexOf(' ');
  // Cut between words: a summary that stops mid-word reads as broken.
  return `${(lastSpace > EXCERPT_LIMIT / 2 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * The date a post was published, in Philippine time.
 *
 * The portal sends UTC and Vercel's servers run in UTC, so formatting without
 * an explicit zone would put a post published at 9am in Laguna on the previous
 * day — `2026-05-14T01:00:00Z` is 9am on the 14th in Manila, but the 14th is
 * only just starting in UTC. The same rule as event dates.
 */
export function formatPostDate(publishedAt: string): string {
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-PH', {
    timeZone: EVENT_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Posts newest first.
 *
 * The portal already sorts them, and sorting again costs nothing and means the
 * page does not depend on that promise — the one rule of this integration is
 * that the portal's guarantees live in another codebase.
 */
export function sortPosts(posts: PortalPost[]): PortalPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );
}

/** The post with this slug, or undefined — which the page turns into a 404. */
export function findPost(posts: PortalPost[], slug: string): PortalPost | undefined {
  return posts.find((post) => post.slug === slug);
}
