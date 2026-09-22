import { test, expect } from '@playwright/test';
import { parseLandingImages } from '../lib/portal/parse';
import { resolveLandingImages, BUILT_IN_LANDING_IMAGES, WHAT_WE_DO_CARDS } from '../lib/portal/landing-images';
import { slides } from '../lib/content/about-devcon-slideshow';
import { whatWeDo } from '../lib/content/what-we-do';
import { programsAndActivities } from '../lib/content/programs-and-activities';
import type { LandingSlot, PortalLandingImage } from '../lib/portal/types';

/**
 * Regression suite for CMS-04 (#77) — landing page images from the portal.
 *
 * The rules are tested directly against the resolver, so they run without a
 * portal or an API key. Each slot falls back to its built-in picture on its
 * own; the page-level behaviour was verified by hand against a mock portal.
 */

const STORAGE = 'https://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public/landing';
let n = 0;
function image(slot: LandingSlot, extra: Partial<PortalLandingImage> = {}): PortalLandingImage {
  n += 1;
  return { id: `img-${n}`, slot, image_url: `${STORAGE}/${n}.jpg`, alt: `Photo ${n}`, label: null, display_order: n, ...extra };
}

test.describe('CMS-04 parsing', () => {
  const valid = { id: 'a', slot: 'bottom', image_url: `${STORAGE}/a.jpg`, alt: 'A banner', label: null, display_order: 0 };

  test('keeps a valid image', () => {
    expect(parseLandingImages([valid])).toHaveLength(1);
  });

  test('drops images it cannot place or describe', () => {
    for (const bad of [
      { ...valid, slot: 'sidebar' },
      { ...valid, slot: undefined },
      { ...valid, alt: '' },
      { ...valid, alt: '   ' },
      { ...valid, alt: null },
      { ...valid, image_url: '' },
      { ...valid, id: 7 },
      null,
    ]) {
      expect(parseLandingImages([bad]), JSON.stringify(bad)).toEqual([]);
    }
  });

  test('treats a blank label as no label', () => {
    expect(parseLandingImages([{ ...valid, label: '  ' }])[0].label).toBeNull();
  });

  test('tolerates a missing or malformed images array', () => {
    // The portal sends `images: []` when its images fail to load; older
    // payloads have no `images` at all.
    expect(parseLandingImages(undefined)).toEqual([]);
    expect(parseLandingImages({})).toEqual([]);
  });
});

test.describe('CMS-04 an empty portal changes nothing', () => {
  test('every slot keeps its built-in picture', () => {
    const resolved = resolveLandingImages([]);
    expect(resolved.hero).toEqual({ desktop: undefined, mobile: undefined });
    expect(resolved.carousel).toBe(slides);
    expect(resolved.whatWeDo).toBe(whatWeDo);
    expect(resolved.programs).toBe(programsAndActivities);
    expect(BUILT_IN_LANDING_IMAGES).toEqual(resolved);
  });
});

test.describe('CMS-04 slots fall back independently', () => {
  test('a hero upload does not touch any other slot', () => {
    const resolved = resolveLandingImages([image('hero-desktop')]);
    expect(resolved.hero.desktop?.src).toContain(STORAGE);
    expect(resolved.hero.mobile).toBeUndefined();
    expect(resolved.carousel).toBe(slides);
  });

  test('hero desktop and mobile are independent, first by display order', () => {
    const resolved = resolveLandingImages([
      image('hero-mobile', { display_order: 5, alt: 'Second' }),
      image('hero-mobile', { display_order: 1, alt: 'First' }),
    ]);
    expect(resolved.hero.mobile?.alt).toBe('First');
    expect(resolved.hero.desktop).toBeUndefined();
  });

  test('the carousel takes any number of photos, in display order', () => {
    const resolved = resolveLandingImages([
      image('who-we-are-carousel', { display_order: 2, alt: 'B' }),
      image('who-we-are-carousel', { display_order: 1, alt: 'A' }),
    ]);
    expect(resolved.carousel.map((s) => s.alt)).toEqual(['A', 'B']);
  });
});

test.describe('CMS-04 What We Do needs all five', () => {
  test('fewer than five keeps the whole built-in grid, never a mix', () => {
    for (let count = 1; count < WHAT_WE_DO_CARDS; count += 1) {
      const images = Array.from({ length: count }, () => image('what-we-do', { label: 'Card' }));
      expect(resolveLandingImages(images).whatWeDo, `${count} images`).toBe(whatWeDo);
    }
  });

  test('five or more uses the first five, with the second tall', () => {
    const images = Array.from({ length: 7 }, (_, i) => image('what-we-do', { label: `Card ${i + 1}`, display_order: i }));
    const cards = resolveLandingImages(images).whatWeDo;
    expect(cards).toHaveLength(5);
    expect(cards.map((c) => c.title)).toEqual(['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5']);
    expect(cards.map((c) => Boolean(c.isTall))).toEqual([false, true, false, false, false]);
    expect(cards.every((c) => c.alt && c.alt.length > 0)).toBe(true);
  });
});

test.describe('CMS-04 the bottom slot', () => {
  test('replaces only the first Programs & Activities banner', () => {
    const resolved = resolveLandingImages([image('bottom', { alt: 'Summer coding camp for kids' })]);
    const [first, ...rest] = resolved.programs;
    expect(first.bannerImg).toContain(STORAGE);
    expect(first.bannerAlt).toBe('Summer coding camp for kids');
    // The slide control reads "Go to slide 1: …"; it must describe the new banner.
    expect(first.title).toBe('Summer coding camp for kids');
    // Buttons are unchanged.
    expect(first.primaryBtnLink).toBe(programsAndActivities[0].primaryBtnLink);
    expect(rest).toEqual(programsAndActivities.slice(1));
  });
});

test.describe('CMS-04 image hosts', () => {
  test('an image outside the portal\'s storage is skipped, not rendered broken', () => {
    const resolved = resolveLandingImages([image('hero-desktop', { image_url: 'https://media.tenor.com/x/y.gif' })]);
    expect(resolved.hero.desktop).toBeUndefined();
  });
});

test.describe('CMS-04 page', () => {
  test('the About carousel does not preload a photo', async ({ request }) => {
    // It used to be `priority`: a preloaded photo on every device, including
    // phones where the carousel is hidden, competing with the hero's LCP.
    const html = await (await request.get('/')).text();
    const preloads = html.match(/<link[^>]+rel="preload"[^>]*>/g) ?? [];
    const photoPreloads = preloads.filter((tag) => slides.some((slide) => tag.includes(encodeURIComponent(slide.src)) || tag.includes(slide.src)));
    expect(photoPreloads).toEqual([]);
  });

  test('the hero is a fixed frame, so an upload cannot reflow the page', async ({ page }) => {
    await page.goto('/');
    const ratio = await page.locator('#hero picture img').evaluate((img) => getComputedStyle(img).aspectRatio);
    expect(ratio).toBe('2048 / 2036');
  });
});
