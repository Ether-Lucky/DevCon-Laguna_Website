import { expect, type Page } from '@playwright/test';
import { waitForHydration } from './hydration';

/**
 * Fills a field and makes sure the value stuck (CICD-BT-06).
 *
 * The contact form is a client component. Typing into it before React has
 * hydrated works on the DOM, but hydration then resets the input to its
 * (empty) state, so the value silently disappears. Only the **first** field
 * filled is affected; by the time the next one is typed, hydration has
 * finished.
 *
 * That is what made `contact.spec.ts` flaky on WebKit: under load, hydration
 * lost the race, the name arrived empty, validation refused the submit, and
 * the success banner never appeared. It failed 6 of 6 runs in parallel and 0
 * of 8 alone, which is why CI's retries usually rescued it.
 *
 * Retrying the fill until the value holds is the honest wait: it waits for the
 * form to be genuinely interactive, rather than for a fixed number of
 * milliseconds that would be too long on a fast machine and too short on a
 * loaded one.
 */
export async function fillWhenReady(page: Page, selector: string, value: string): Promise<void> {
  await waitForHydration(page, selector);
  // Belt and braces: if hydration lands between the check and the keystroke,
  // the value is typed again.
  await expect(async () => {
    await page.fill(selector, value);
    await expect(page.locator(selector)).toHaveValue(value, { timeout: 1000 });
  }).toPass({ timeout: 15_000 });
}

/** Fills the whole contact form, hydration-safe. */
export async function fillContactForm(
  page: Page,
  fields: { name?: string; email?: string; subject?: string; message?: string } = {},
): Promise<void> {
  const values = {
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    subject: 'Speaking proposal',
    message: 'I would love to speak at the next DevCon Laguna event.',
    ...fields,
  };
  for (const [field, value] of Object.entries(values)) {
    await fillWhenReady(page, `#${field}`, value);
  }
}

/**
 * Clicks a control repeatedly until its effect happens (CICD-BT-06).
 *
 * `ScrollReveal` slides each section in with a 0.85s translate/fade transition
 * when it enters the viewport. A test that clicks straight after jumping to
 * `/#contact` can send its click while the section is still moving: Playwright
 * checks the target is stable once, then fires mousedown+mouseup — if a layout
 * shift moves the element in between, the click lands on the wrong target and
 * the form is left untouched (fields filled, button still "Send message", no
 * banner). Under WebKit with `--repeat-each=20` this surfaced in the conversion
 * tests: `contact-success` never appeared but nothing had actually failed.
 *
 * Retrying the click until the expected effect is visible makes the
 * interaction deterministic without disabling the animation the test runs
 * against, and re-clicking a spent control is safe because the effect
 * assertion exits the loop the instant it passes.
 */
export async function clickUntilEffect(
  click: () => Promise<void>,
  effect: () => Promise<void>,
  timeout = 20_000,
): Promise<void> {
  await expect(async () => {
    await click();
    await effect();
  }).toPass({ timeout });
}
