import { test, expect, Page } from '@playwright/test';
import { waitForHydration } from './support/hydration';

/**
 * OFFICER-02 — the Officers carousel shows a whole batch and steps by one column.
 *
 * The section used to be a free-scrolling region, which left a half-cut officer
 * at the right edge and gave no clear boundary between what had been seen and
 * what was next. It now shows a fixed batch of complete columns (two officers
 * each) and moves by exactly one column per press.
 *
 * These tests measure **tiles**, not headings. A heading is narrower than its
 * tile, so a tile clipped by a few pixels would still report its heading as
 * fully visible and the "no half-cut card" assertion would pass on a page that
 * shows one.
 */

/** Indices of the tiles lying wholly inside the carousel's clipped viewport. */
async function visibleTiles(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    const section = document.querySelector('#officers');
    const clip = section?.querySelector('[role="group"]');
    if (!clip) return [];
    const box = clip.getBoundingClientRect();
    return [...clip.querySelectorAll('[data-carousel-tile]')]
      .filter((tile) => {
        const rect = tile.getBoundingClientRect();
        // 1px of slack for sub-pixel layout; anything more is a cut card.
        return rect.left >= box.left - 1 && rect.right <= box.right + 1;
      })
      .map((tile) => Number(tile.getAttribute('data-carousel-tile')));
  });
}

/** Officer names inside the tiles that are wholly visible, in page order. */
async function visibleOfficers(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const section = document.querySelector('#officers');
    const clip = section?.querySelector('[role="group"]');
    if (!clip) return [];
    const box = clip.getBoundingClientRect();
    return [...clip.querySelectorAll('[data-carousel-tile]')]
      .filter((tile) => {
        const rect = tile.getBoundingClientRect();
        return rect.left >= box.left - 1 && rect.right <= box.right + 1;
      })
      .flatMap((tile) => [...tile.querySelectorAll('h3')].map((h) => h.textContent?.trim() ?? ''));
  });
}

/**
 * Elements drawn outside the column they belong to.
 *
 * Tile boxes alone are not enough: a card with a fixed-width child keeps its
 * tile's computed width and simply spills over it, which looks exactly like the
 * half-cut card this ticket removed.
 */
async function overflowingContent(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const clip = document.querySelector('#officers [role="group"]');
    if (!clip) return ['no carousel'];
    const clipBox = clip.getBoundingClientRect();
    const spills: string[] = [];
    for (const tile of clip.querySelectorAll('[data-carousel-tile]')) {
      const tileBox = tile.getBoundingClientRect();
      if (tileBox.left < clipBox.left - 1 || tileBox.right > clipBox.right + 1) continue;
      for (const node of tile.querySelectorAll('*')) {
        const rect = node.getBoundingClientRect();
        if (rect.width === 0) continue;
        if (rect.left < tileBox.left - 1 || rect.right > tileBox.right + 1) {
          spills.push(`${tile.getAttribute('data-carousel-tile')}: ${node.tagName}.${node.className}`);
        }
      }
    }
    return spills;
  });
}

/**
 * The track animates for 500ms, so every assertion about what is on screen has
 * to be retried rather than read once. `toPass` also means a failure here is a
 * real one and not a race with the transition.
 */
async function expectVisibleTiles(page: Page, expected: number[]) {
  await expect(async () => {
    expect(await visibleTiles(page)).toEqual(expected);
  }).toPass({ timeout: 5000 });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page, '#officers');
  await page.locator('#officers').scrollIntoViewIfNeeded();
});

test.describe('OFFICER-02 batch carousel', () => {
  test('shows a batch of four whole columns on a desktop viewport', async ({ page }) => {
    await expectVisibleTiles(page, [0, 1, 2, 3]);

    // Eight officers, and — the point of the ticket — no ninth card peeking in
    // half cut at the right edge.
    const officers = await visibleOfficers(page);
    expect(officers).toHaveLength(8);
    expect(await overflowingContent(page)).toEqual([]);
  });

  test('stepping forward drops the first column and reveals one new one', async ({ page }) => {
    const before = await visibleOfficers(page);

    await page.locator('#officers').getByRole('button', { name: 'Next officers' }).click();
    await expectVisibleTiles(page, [1, 2, 3, 4]);

    const after = await visibleOfficers(page);
    // The two officers of the leading column are gone, the rest shifted up by a
    // column, and two officers who were not on screen now are.
    expect(after.slice(0, 6)).toEqual(before.slice(2));
    expect(before).not.toContain(after[6]);
    expect(before).not.toContain(after[7]);
  });

  test('stepping back restores the previous batch', async ({ page }) => {
    const first = await visibleOfficers(page);
    const section = page.locator('#officers');

    await section.getByRole('button', { name: 'Next officers' }).click();
    await expectVisibleTiles(page, [1, 2, 3, 4]);

    await section.getByRole('button', { name: 'Previous officers' }).click();
    await expectVisibleTiles(page, [0, 1, 2, 3]);
    expect(await visibleOfficers(page)).toEqual(first);
  });

  test('the controls stop at both ends instead of wrapping', async ({ page }) => {
    const section = page.locator('#officers');
    const next = section.getByRole('button', { name: 'Next officers' });
    const previous = section.getByRole('button', { name: 'Previous officers' });

    await expect(previous).toBeDisabled();
    await expect(next).toBeEnabled();

    // Twelve bundled officers make six columns; four are shown, so the track
    // runs out after two steps.
    await next.click();
    await next.click();
    await expectVisibleTiles(page, [2, 3, 4, 5]);
    await expect(next).toBeDisabled();
    await expect(previous).toBeEnabled();
  });

  test('every officer stays in the document while clipped', async ({ page }) => {
    // Clipping rather than unmounting is what keeps the whole roster reachable
    // by a screen reader without depending on the buttons being found.
    const headings = page.locator('#officers [data-carousel-tile] h3');
    const total = await headings.count();
    expect(total).toBeGreaterThan(8);

    await page.locator('#officers').getByRole('button', { name: 'Next officers' }).click();
    await expectVisibleTiles(page, [1, 2, 3, 4]);
    expect(await headings.count()).toBe(total);
  });

  test('announces the visible range politely', async ({ page }) => {
    const status = page.locator('#officers [aria-live="polite"]');
    const opening = (await status.textContent()) ?? '';
    expect(opening).toMatch(/^Showing officers 1 to \d+ of \d+$/);

    await page.locator('#officers').getByRole('button', { name: 'Next officers' }).click();
    await expect(status).not.toHaveText(opening);
  });

  test('still fits four whole columns at the tightest desktop width', async ({ page }) => {
    // 1024px is where the batch becomes four, so it is where four columns have
    // the least room — and the width at which fixed-width card content used to
    // push the fourth column out of the clip. The default 1280px viewport has
    // enough slack to hide that, so it has to be asserted here.
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.locator('#officers').scrollIntoViewIfNeeded();

    await expectVisibleTiles(page, [0, 1, 2, 3]);
    expect(await overflowingContent(page)).toEqual([]);
  });

  test('narrows to a single column on a phone viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('#officers').scrollIntoViewIfNeeded();

    await expectVisibleTiles(page, [0]);
    expect(await visibleOfficers(page)).toHaveLength(2);
  });
});
