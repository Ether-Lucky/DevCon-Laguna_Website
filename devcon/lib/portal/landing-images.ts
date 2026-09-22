import { slides as bundledSlides, type Slide } from '@/lib/content/about-devcon-slideshow';
import { whatWeDo as bundledWhatWeDo, type WhatWeDoItem } from '@/lib/content/what-we-do';
import { programsAndActivities as bundledPrograms, type ProgramOrActivity } from '@/lib/content/programs-and-activities';
import { isAllowedRemoteImage } from '@/lib/remote-images';
import type { LandingSlot, PortalLandingImage } from './types';

/**
 * Decides, slot by slot, whether the landing page shows the portal's images or
 * its built-in ones (CMS-04).
 *
 * Every slot falls back **independently**: an empty slot keeps its built-in
 * picture, so officers can populate the page one slot at a time and nothing
 * they do can leave a gap. That is also the portal's own contract — "a slot
 * with no rows means keep the built-in picture".
 *
 * Deliberately free of `server-only` so the test suite can check every rule.
 */

export type HeroImage = { src: string; alt: string };

export type LandingImages = {
  hero: { desktop?: HeroImage; mobile?: HeroImage };
  carousel: Slide[];
  whatWeDo: WhatWeDoItem[];
  programs: ProgramOrActivity[];
};

/** The What We Do grid is a fixed bento of exactly this many cards. */
export const WHAT_WE_DO_CARDS = 5;

/** Position of the tall centre card in that grid (the second item). */
const TALL_CARD_INDEX = 1;

/**
 * The frame each What We Do card renders in. The image is `object-cover`
 * inside it, so these fix the aspect ratio the optimiser works with rather than
 * describing the file — the same values the built-in cards use.
 */
const CARD_SIZE = { tall: 596, short: 284 } as const;

/**
 * The images in one slot, in display order, keeping only those the site can
 * actually render. The portal already guarantees its own storage; this check
 * stays because that guarantee lives in another codebase.
 */
function inSlot(images: PortalLandingImage[], slot: LandingSlot): PortalLandingImage[] {
  return images
    .filter((image) => image.slot === slot)
    .filter((image) => {
      if (isAllowedRemoteImage(image.image_url)) return true;
      console.warn(`[portal] landing image ${image.id} (${slot}) is on a host we cannot render and was skipped.`);
      return false;
    })
    .sort((a, b) => a.display_order - b.display_order);
}

function heroImage(images: PortalLandingImage[], slot: 'hero-desktop' | 'hero-mobile'): HeroImage | undefined {
  const [first] = inSlot(images, slot);
  return first ? { src: first.image_url, alt: first.alt } : undefined;
}

/** Any number of photos works: the carousel scrolls. */
function carousel(images: PortalLandingImage[]): Slide[] {
  const photos = inSlot(images, 'who-we-are-carousel');
  if (photos.length === 0) return bundledSlides;
  // width/height are unused here: the carousel frame is a fixed 3:2 box with
  // `fill`, so the file's own proportions never reach the layout.
  return photos.map((photo, index) => ({ id: index + 1, src: photo.image_url, alt: photo.alt, width: 1920, height: 1280 }));
}

/**
 * The grid needs exactly five. Fewer keeps the **whole** built-in grid rather
 * than mixing old and new photos (PM decision, 2026-09-22); more than five uses
 * the first five by display order. The second is the tall centre card.
 */
function whatWeDo(images: PortalLandingImage[]): WhatWeDoItem[] {
  const cards = inSlot(images, 'what-we-do');
  if (cards.length < WHAT_WE_DO_CARDS) {
    if (cards.length > 0) {
      console.warn(`[portal] What We Do has ${cards.length} of ${WHAT_WE_DO_CARDS} images; showing the built-in grid until all ${WHAT_WE_DO_CARDS} exist.`);
    }
    return bundledWhatWeDo;
  }
  return cards.slice(0, WHAT_WE_DO_CARDS).map((card, index) => {
    const isTall = index === TALL_CARD_INDEX;
    const size = isTall ? CARD_SIZE.tall : CARD_SIZE.short;
    return { id: index + 1, title: card.label ?? '', alt: card.alt, img: card.image_url, width: size, height: size, isTall };
  });
}

/**
 * The `bottom` slot is the first Programs & Activities banner (the DevCon Kids
 * slide by default). Only that slide changes; the other two keep their text.
 *
 * The slide's title becomes the image's alt text: a replaced banner carries
 * its own baked-in message, and the title is what names the slide in the
 * carousel's "Go to slide 1: …" control — the old DevCon Kids title would
 * describe a banner that is no longer there.
 */
function programs(images: PortalLandingImage[]): ProgramOrActivity[] {
  const [banner] = inSlot(images, 'bottom');
  if (!banner) return bundledPrograms;
  const [first, ...rest] = bundledPrograms;
  return [{ ...first, bannerImg: banner.image_url, bannerAlt: banner.alt, title: banner.alt }, ...rest];
}

export function resolveLandingImages(images: PortalLandingImage[]): LandingImages {
  return {
    hero: { desktop: heroImage(images, 'hero-desktop'), mobile: heroImage(images, 'hero-mobile') },
    carousel: carousel(images),
    whatWeDo: whatWeDo(images),
    programs: programs(images),
  };
}

/** Everything built-in: what the page shows when the portal is unavailable. */
export const BUILT_IN_LANDING_IMAGES: LandingImages = resolveLandingImages([]);
