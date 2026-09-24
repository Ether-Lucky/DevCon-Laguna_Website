import { test, expect } from '@playwright/test';
import { parsePosts } from '../lib/portal/parse';
import { findPost, formatPostDate, postExcerpt, postPath, sortPosts } from '../lib/portal/posts';
import type { PortalPost } from '../lib/portal/types';

/**
 * NEWS-02 (#179) — news posts from the portal.
 *
 * The rules are tested directly, and the pages themselves are covered against a
 * running site in `portal-data.spec.ts` (with posts) and at the bottom of this
 * file (without any, which is what CI's fallback instance has).
 */

function post(extra: Partial<PortalPost> = {}): PortalPost {
  return {
    id: 'post-1',
    slug: 'a-post',
    title: 'A post',
    body: 'The body.',
    excerpt: 'The excerpt.',
    cover_image_url: null,
    published_at: '2026-05-14T00:00:00.000Z',
    ...extra,
  };
}

test.describe('NEWS-02 parsing', () => {
  const valid = {
    id: 'p1',
    slug: 'a-post',
    title: 'A post',
    body: 'Words.',
    excerpt: null,
    cover_image_url: null,
    published_at: '2026-05-14T00:00:00.000Z',
  };

  test('keeps a valid post', () => {
    expect(parsePosts([valid])).toHaveLength(1);
  });

  test('drops a post it could not address, title or show', () => {
    // Each of these is the post's URL, heading or content. None has a sensible
    // default, and a card with an empty heading is worse than one fewer card.
    for (const bad of [
      { ...valid, id: '' },
      { ...valid, slug: '' },
      { ...valid, slug: 42 },
      { ...valid, title: '   ' },
      { ...valid, body: '' },
      { ...valid, published_at: 'not a date' },
      { ...valid, published_at: null },
      null,
      'a string',
    ]) {
      expect(parsePosts([bad]), JSON.stringify(bad)).toEqual([]);
    }
  });

  test('a missing excerpt or cover is normal, not a reason to drop', () => {
    const [parsed] = parsePosts([{ ...valid, excerpt: '   ', cover_image_url: 7 }]);
    expect(parsed.excerpt).toBeNull();
    expect(parsed.cover_image_url).toBeNull();
  });

  test('anything that is not a list is no posts', () => {
    expect(parsePosts(undefined)).toEqual([]);
    expect(parsePosts({ posts: [] })).toEqual([]);
  });
});

test.describe('NEWS-02 the excerpt', () => {
  test("uses the post's own when it has one", () => {
    expect(postExcerpt(post())).toBe('The excerpt.');
  });

  test('falls back to the opening of the body', () => {
    // The portal makes `excerpt` optional, so this is the difference between a
    // card with a sentence and a card with nothing under its heading.
    expect(postExcerpt(post({ excerpt: null, body: 'A short body.' }))).toBe('A short body.');
  });

  test('collapses the paragraph breaks it borrows', () => {
    expect(postExcerpt(post({ excerpt: null, body: 'First line.\n\nSecond line.' }))).toBe(
      'First line. Second line.',
    );
  });

  test('cuts a long body on a word boundary', () => {
    const body = `${'alpha bravo charlie '.repeat(20)}end`;
    const result = postExcerpt(post({ excerpt: null, body }));
    expect(result.endsWith('…')).toBe(true);

    const kept = result.slice(0, -1);
    expect(body.startsWith(kept)).toBe(true);
    expect(body[kept.length]).toBe(' ');
  });
});

test.describe('NEWS-02 dates and order', () => {
  test('shows the date in Philippine time', () => {
    // 01:00 UTC on the 14th is 9am on the 14th in Manila. Formatting without an
    // explicit zone would be a day out for anything published before 8am local.
    // The format matches the event date labels — "May 14, 2026" — so the two
    // kinds of date on the site read the same way.
    expect(formatPostDate('2026-05-14T01:00:00.000Z')).toBe('May 14, 2026');
    // 23:00 UTC on the 13th is already the 14th in Manila. This is the
    // assertion that fails if the time zone is ever dropped.
    expect(formatPostDate('2026-05-13T23:00:00.000Z')).toBe('May 14, 2026');
  });

  test('an unreadable date is empty rather than "Invalid Date"', () => {
    expect(formatPostDate('nonsense')).toBe('');
  });

  test('sorts newest first, whatever order the portal sent', () => {
    const older = post({ id: 'old', slug: 'old', published_at: '2026-01-01T00:00:00.000Z' });
    const newer = post({ id: 'new', slug: 'new', published_at: '2026-06-01T00:00:00.000Z' });
    expect(sortPosts([older, newer]).map((p) => p.id)).toEqual(['new', 'old']);
    expect(sortPosts([newer, older]).map((p) => p.id)).toEqual(['new', 'old']);
  });
});

test.describe('NEWS-02 addressing a post', () => {
  test('lives under /news, escaped', () => {
    expect(postPath(post({ slug: 'hackathon-recap' }))).toBe('/news/hackathon-recap');
    expect(postPath(post({ slug: 'a b/c' }))).toBe('/news/a%20b%2Fc');
  });

  test('an unknown slug finds nothing, which the page turns into a 404', () => {
    expect(findPost([post()], 'no-such-post')).toBeUndefined();
    expect(findPost([], 'a-post')).toBeUndefined();
  });
});

test.describe('NEWS-02 with no posts at all', () => {
  test('the homepage has no news section', async ({ page }) => {
    await page.goto('/');
    // A "Latest News" heading over nothing tells a visitor the chapter has
    // nothing to say. The section does not render at all.
    await expect(page.locator('#news')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Latest News/i })).toHaveCount(0);
  });

  test('/news still exists and says so', async ({ page }) => {
    // The index is a destination people are sent to. A 404 for a link in a chat
    // message is worse than a page that says there is nothing yet.
    const response = await page.goto('/news');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: /Latest News/i, level: 1 })).toBeVisible();
    await expect(page.getByText(/No news yet/i)).toBeVisible();
  });

  test('an unknown post is a 404', async ({ page }) => {
    const response = await page.goto('/news/no-such-post');
    expect(response?.status()).toBe(404);
  });

  test('the footer links to the news index', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer').getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news');
  });
});
