import type { Page } from '@playwright/test';

/**
 * Waits until React has hydrated the element, so the page is genuinely
 * interactive before a test acts on it (CICD-BT-06).
 *
 * React attaches internal properties (`__reactFiber$…`) to a DOM node when it
 * hydrates. Until then the node is server-rendered HTML: it looks right and
 * reads right, but nothing is wired up. Typing into it is undone by hydration,
 * and timers a component starts in an effect do not exist yet.
 *
 * Both flaky suites came from this. The contact form lost its first field, and
 * the Programs carousel did not advance: the markup already said the slideshow
 * was playing, because that is its server-rendered state, so the test moved a
 * fake clock past a timer that had not been created.
 *
 * Waiting for the marker is the honest wait. A fixed delay is too long on a
 * fast machine and too short on a loaded one, which is exactly when CI fails.
 */
export async function waitForHydration(page: Page, selector: string): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      return !!el && Object.keys(el).some((key) => key.startsWith('__reactFiber$'));
    },
    selector,
    { timeout: 20_000 },
  );
}
