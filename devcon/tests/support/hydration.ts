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

/**
 * Waits until a section's entrance animation has finished.
 *
 * `ScrollReveal` wraps every section in a div that starts at `opacity: 0` with a
 * translate, and transitions both over 0.85s when the section scrolls into view.
 * A test that scrolls to a section and immediately presses a button inside it is
 * pressing a moving target: Playwright checks that the element is stable, the
 * check passes near the end of the transition, and the click still lands a few
 * pixels off. That is the OFFICER-02-BT-01 flake — firefox reported "pressing
 * Next officers did not reach the carousel", which is exactly a click that hit
 * nothing.
 *
 * Waiting for the wrapper to reach its settled values is deterministic, unlike a
 * fixed delay, and it does not disable the animation — the animated path is what
 * a visitor gets, so it is the path worth testing.
 */
export async function waitForReveal(page: Page, selector: string): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      // Walk up to the wrapper: it is the ancestor transitioning opacity.
      let node = el.parentElement;
      while (node) {
        const style = getComputedStyle(node);
        if (style.transitionProperty.includes('opacity')) {
          const settled = style.transform === 'none' || style.transform === 'matrix(1, 0, 0, 1, 0, 0)';
          return style.opacity === '1' && settled;
        }
        node = node.parentElement;
      }
      // No wrapper found: nothing is animating, so nothing to wait for.
      return true;
    },
    selector,
    { timeout: 20_000 },
  );
}
