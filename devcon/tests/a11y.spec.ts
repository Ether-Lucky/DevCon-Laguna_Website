import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility suite for A11Y-01 (#116).
 *
 * The Definition of Done asks for "no critical axe violations". Lighthouse
 * already reports 0.96, but that is not the same thing: it runs a subset of axe
 * rules against one viewport in one theme and cannot see an interactive state.
 * Every violation this suite was written against was invisible to Lighthouse.
 *
 * The audit runs across both themes, both viewports, and the states a visitor
 * actually reaches — because that is where the findings were.
 */

/**
 * Every audit runs with motion off (CICD-BT-06).
 *
 * `ScrollReveal` animates sections in by fading their opacity, and axe computes
 * contrast from the colours as rendered. Text caught mid-fade measures as
 * low-contrast, which failed this suite intermittently on WebKit in CI — once,
 * with 8 contrast violations in the Contact section, then passing on retry.
 * `ScrollReveal` honours `prefers-reduced-motion`, so nothing is animating
 * while axe measures, and a contrast failure means a real one.
 *
 * Set through `contextOptions`: Playwright 1.61 no longer takes `reducedMotion`
 * as a top-level test option.
 */
test.use({ contextOptions: { reducedMotion: 'reduce' } });

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];
const BLOCKING = ['critical', 'serious'];

/**
 * Scrolls the page from top to bottom before auditing.
 *
 * Not incidental. `ScrollReveal` renders each section at opacity 0 until it
 * enters the viewport, and axe skips elements that are not visible — so an
 * audit at the top of the page silently examines the hero and almost nothing
 * else. The first run of this audit reported zero violations for that reason,
 * while five real contrast failures sat further down the page.
 */
async function revealWholePage(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
}

async function expectNoBlockingViolations(page: Page, context: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const blocking = violations.filter((v) => BLOCKING.includes(v.impact ?? ''));

  const detail = blocking
    .map((v) => `${v.impact} ${v.id} (x${v.nodes.length}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(' ')).join('\n    ')}`)
    .join('\n');

  expect(blocking, `${context} has blocking accessibility violations:\n${detail}`).toEqual([]);
}

async function openWithTheme(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript((value) => window.localStorage.setItem('theme', value), theme);
  await page.goto('/', { waitUntil: 'load' });
}

test('the audits really do run with motion disabled', async ({ page }) => {
  // Guards the `contextOptions` above. Playwright 1.61 already moved this
  // option once; if it moves again, `test.use` would silently stop applying it
  // and the mid-fade contrast flake would come back with nothing to show why.
  await page.goto('/');
  const reduced = await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  expect(reduced, 'accessibility audits must run with prefers-reduced-motion').toBe(true);
});

for (const theme of ['dark', 'light'] as const) {
  test.describe(`A11Y-01 axe audit — ${theme} theme`, () => {
    test('the whole page has no critical or serious violations', async ({ page }) => {
      await openWithTheme(page, theme);
      await revealWholePage(page);
      await expectNoBlockingViolations(page, `${theme} full page`);
    });

    test('the contact form in its error state has none', async ({ page }) => {
      await openWithTheme(page, theme);
      await revealWholePage(page);
      // Submitting an empty form is the fastest way to render every error
      // message. Error text was one of the real findings: 12px orange on the
      // light background measured 3.1:1 against a 4.5:1 requirement.
      await page.getByRole('button', { name: /send/i }).click();
      await page.waitForTimeout(500);
      await expectNoBlockingViolations(page, `${theme} contact errors`);
    });

    test('the open mobile menu has none', async ({ page }) => {
      await openWithTheme(page, theme);
      await page.setViewportSize({ width: 390, height: 844 });
      await revealWholePage(page);
      await page.getByRole('button', { name: /open navigation menu/i }).click();
      await page.waitForTimeout(400);
      await expectNoBlockingViolations(page, `${theme} mobile menu open`);
    });
  });
}

// The legal pages (LEGAL-01) get the same audit as the landing page. Until
// Sprint 4 there was only one route, so this suite had only ever audited `/`.
for (const path of ['/privacy', '/terms']) {
  for (const theme of ['dark', 'light'] as const) {
    test(`${path} has no critical or serious violations — ${theme} theme`, async ({ page }) => {
      await page.addInitScript((value) => window.localStorage.setItem('theme', value), theme);
      await page.goto(path, { waitUntil: 'load' });
      await revealWholePage(page);
      await expectNoBlockingViolations(page, `${theme} ${path}`);
    });
  }
}

test.describe('A11Y-01 keyboard access', () => {
  test('every carousel track is focusable and named', async ({ page }) => {
    await page.goto('/');
    await revealWholePage(page);

    // Before this ticket the tracks were plain scrollable divs. A keyboard user
    // could only move them with the arrow buttons, so any tile scrolled out of
    // view was unreachable — axe reports it as a serious violation, and it was
    // one of the two found on the landing page.
    // Scrollable tracks only. The Programs & Activities slide is also a labelled
    // group (the WAI-ARIA carousel pattern), but it does not scroll, so it is
    // correctly not focusable and is excluded by its roledescription.
    const tracks = page.locator('[role="group"][aria-label]:not([aria-roledescription])');
    const count = await tracks.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const names = new Set<string>();
    for (let i = 0; i < count; i += 1) {
      const track = tracks.nth(i);
      await expect(track).toHaveAttribute('tabindex', '0');
      const name = await track.getAttribute('aria-label');
      // Distinct names matter: three regions all called "Carousel" tell a
      // screen reader user nothing about which one they are in.
      expect(name, 'carousel names must be unique').not.toBe(null);
      expect(names.has(name!), `duplicate carousel name: ${name}`).toBe(false);
      names.add(name!);
    }
  });

  test('a carousel scrolls with the arrow keys once focused', async ({ page }) => {
    await page.goto('/');
    await revealWholePage(page);

    const track = page.locator('[role="group"][aria-label]:not([aria-roledescription])').first();
    await track.scrollIntoViewIfNeeded();
    await track.focus();
    await expect(track).toBeFocused();

    const before = await track.evaluate((el) => el.scrollLeft);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
    const after = await track.evaluate((el) => el.scrollLeft);

    expect(after, 'focused carousel should scroll with ArrowRight').toBeGreaterThan(before);
  });

  test('the theme toggle is reachable and operable by keyboard', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /switch to (light|dark) mode/i });
    await toggle.focus();
    await expect(toggle).toBeFocused();

    const before = await page.evaluate(() => document.documentElement.className);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => document.documentElement.className);

    expect(after, 'Enter on the theme toggle should change the theme').not.toBe(before);
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/');

    // A focus state that is present but invisible is the same as none for a
    // sighted keyboard user, so this checks the computed outline rather than
    // just that something received focus.
    const link = page.locator('nav a').first();
    await link.focus();
    const outline = await link.evaluate((el) => {
      const style = getComputedStyle(el);
      return { width: style.outlineWidth, style: style.outlineStyle, shadow: style.boxShadow };
    });

    const hasVisibleFocus =
      (outline.style !== 'none' && parseFloat(outline.width) > 0) || outline.shadow !== 'none';
    expect(hasVisibleFocus, `no visible focus indicator: ${JSON.stringify(outline)}`).toBe(true);
  });
});
