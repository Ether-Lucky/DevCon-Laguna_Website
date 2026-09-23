import { expect, type Page } from '@playwright/test';

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
/**
 * Has a computed `transform` settled back to "not transformed"?
 *
 * Compared with a tolerance rather than by string. Browsers spell it three
 * different ways — `none`, `matrix(1, 0, 0, 1, 0, 0)`, and on WebKit sometimes
 * `matrix(1, 0, 0, 1, 0, 0.000001)`, a sub-pixel residue of the transition. All
 * three mean the same thing to a visitor, and a millionth of a pixel cannot move
 * a click off a button.
 *
 * Matching exact strings is what made this check itself flaky
 * (OFFICER-02-BT-02): it failed on a page that had revealed perfectly well.
 */
export function isSettledTransform(value: string): boolean {
  if (value === 'none' || value === '') return true;
  const numbers = value.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(Number);
  if (!numbers || numbers.length !== 6 || numbers.some(Number.isNaN)) return false;
  const [a, b, c, d, e, f] = numbers;
  return (
    Math.abs(a - 1) < 0.01 &&
    Math.abs(d - 1) < 0.01 &&
    Math.abs(b) < 0.01 &&
    Math.abs(c) < 0.01 &&
    Math.abs(e) < 0.5 &&
    Math.abs(f) < 0.5
  );
}

/**
 * The computed state of the `ScrollReveal` wrapper around a section, or null
 * when the section is not wrapped in one.
 *
 * Returns the raw values as well as the verdict, so a failure can say what it
 * saw rather than only that it was unhappy.
 */
export async function readRevealState(
  page: Page,
  selector: string,
): Promise<{ settled: boolean; opacity: string; transform: string } | null> {
  const raw = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    let node = el?.parentElement ?? null;
    while (node) {
      const style = getComputedStyle(node);
      // ScrollReveal is the ancestor transitioning opacity.
      if (style.transitionProperty.includes('opacity')) {
        return { opacity: style.opacity, transform: style.transform };
      }
      node = node.parentElement;
    }
    return null;
  }, selector);

  if (!raw) return null;
  return { ...raw, settled: raw.opacity === '1' && isSettledTransform(raw.transform) };
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
 * Waiting for the wrapper to settle is deterministic, unlike a fixed delay, and
 * it does not disable the animation — the animated path is what a visitor gets,
 * so it is the path worth testing.
 *
 * A section with no reveal wrapper needs no wait, and says so immediately.
 */
export async function waitForReveal(page: Page, selector: string): Promise<void> {
  await expect
    .poll(async () => (await readRevealState(page, selector))?.settled ?? true, {
      timeout: 20_000,
      message: `section ${selector} never finished its entrance animation`,
    })
    .toBe(true);
}
