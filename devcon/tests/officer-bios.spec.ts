import { test, expect } from '@playwright/test';
import { renderableBio, toTeamMember, toTeamMembers } from '../lib/portal/officers';
import type { PortalOfficer } from '../lib/portal/types';

/**
 * OFFICER-03 (#155) — officer bios, shown when the portal provides one.
 *
 * The mapping rules are tested directly, as CMS-04's slot rules are: the portal
 * is a separate deployment with no test data of its own, so a rule that can only
 * be checked through a running page effectively cannot be checked at all.
 *
 * The page-level absence case — the site as it stands today, with a roster that
 * has no bios — is asserted against the running site at the bottom.
 */

function officer(extra: Partial<PortalOfficer> = {}): PortalOfficer {
  return {
    id: 'a',
    name: 'Ada Lovelace',
    title: 'President',
    term_year: 2026,
    display_order: 1,
    photo_url: null,
    bio: null,
    ...extra,
  };
}

test.describe('OFFICER-03 which bios are renderable', () => {
  test('keeps a real bio, trimmed', () => {
    expect(renderableBio('  Writes compilers.  ')).toBe('Writes compilers.');
  });

  test('treats nothing-to-say as no bio', () => {
    // All four mean the same thing to a reader. Collapsing them here is what
    // lets the card ask one question — is there a bio? — instead of deciding
    // whether whitespace counts as content.
    for (const empty of [null, undefined, '', '   ', '\n\t ']) {
      expect(renderableBio(empty), JSON.stringify(empty)).toBeUndefined();
    }
  });

  test('treats a non-string as no bio', () => {
    // The portal types this as `string | null`, but that guarantee lives in
    // another codebase. A number here would otherwise render as a number.
    for (const wrong of [42, {}, [], true]) {
      expect(renderableBio(wrong), JSON.stringify(wrong)).toBeUndefined();
    }
  });
});

test.describe('OFFICER-03 officers as card data', () => {
  test('carries the bio through when there is one', () => {
    const member = toTeamMember(officer({ bio: 'Runs the hackathons.' }), 0, undefined);
    expect(member.bio).toBe('Runs the hackathons.');
  });

  test('leaves bio undefined when there is none', () => {
    expect(toTeamMember(officer(), 0, undefined).bio).toBeUndefined();
  });

  test('honours the portal display order, and keeps colours with it', () => {
    const members = toTeamMembers(
      [officer({ id: 'b', name: 'Second', display_order: 2 }), officer({ id: 'a', name: 'First', display_order: 1 })],
      () => undefined,
    );
    expect(members.map((m) => m.name)).toEqual(['First', 'Second']);
    // Accents follow sorted position, so they stay stable as long as the order
    // does — a random colour would fail the visual suite on every run.
    expect(members[0].accent).not.toBe(members[1].accent);
  });

  test('one officer without a bio does not affect the others', () => {
    const members = toTeamMembers(
      [officer({ id: 'a', display_order: 1, bio: 'Has one.' }), officer({ id: 'b', display_order: 2, bio: '  ' })],
      () => undefined,
    );
    expect(members[0].bio).toBe('Has one.');
    expect(members[1].bio).toBeUndefined();
  });
});

test.describe('OFFICER-03 on the page', () => {
  test('a roster without bios renders no bio element at all', async ({ page }) => {
    await page.goto('/');
    // Not "renders an empty paragraph": an officer who has not written a bio
    // must get exactly the card this section had before the feature existed.
    // This is also the live site's current state, so it is the case that would
    // regress silently.
    const bios = page.locator('#officers [data-officer-bio]');
    const headings = page.locator('#officers [data-carousel-tile] h3');
    expect(await headings.count()).toBeGreaterThan(0);
    expect(await bios.count()).toBe(0);
  });
});
