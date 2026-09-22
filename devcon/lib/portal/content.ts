import 'server-only';

import { team, type TeamMember } from '@/lib/content/officers';
import { events as bundledEvents, type EventItem } from '@/lib/content/events';
import { isAllowedRemoteImage } from '@/lib/remote-images';
import { fetchPortalLanding } from './client';
import { formatEventDate } from './format';
import { BUILT_IN_LANDING_IMAGES, resolveLandingImages, type LandingImages } from './landing-images';
import type { PortalEvent, PortalOfficer } from './types';

/**
 * Landing page content, sourced from the DevConnect Portal with the bundled
 * files as the fallback (CMS-02, CMS-03, CMS-04).
 *
 * Every function here returns renderable content no matter what the portal
 * does. The bundled content in `lib/content/` stops being the source of truth
 * and becomes the safety net: if the portal is down, misconfigured, or has not
 * been populated yet, the page looks exactly as it does today rather than
 * showing an empty section.
 *
 * That is not defensive padding. The portal is a separate deployment owned by a
 * separate account, so its availability is genuinely outside this project's
 * control, and a landing page that breaks when someone else deploys is not an
 * acceptable design.
 */

/**
 * The portal has no accent colour, so one is assigned by position.
 *
 * Deterministic on purpose: the same officer keeps the same colour across
 * renders and across deployments. Anything random would make the visual
 * regression suite fail on every run for no real reason.
 */
const ACCENTS = ['yellow', 'orange', 'purple', 'lime'] as const;

/** Officer photos are square avatars in a fixed-size circular frame. */
const AVATAR_SIZE = 960;

/**
 * The officer's photo, or undefined when it cannot be rendered.
 *
 * The card shows initials for a missing photo — a supported state. A photo on
 * a host `next/image` will not optimise is not: the optimiser answers 400 and
 * the visitor sees a broken image. That happened in production, when the
 * portal held officers whose photos were linked from Tenor rather than
 * uploaded. Treating an unrenderable URL as no photo turns that into initials.
 *
 * Logged, because the fix belongs in the portal's data and someone needs to
 * know to make it.
 */
function renderablePhoto(url: string | null, what: string): string | undefined {
  if (!url) return undefined;
  if (isAllowedRemoteImage(url)) return url;
  console.warn(`[portal] ${what} on a host we cannot render, using the placeholder: ${url}`);
  return undefined;
}

function toTeamMember(officer: PortalOfficer, index: number): TeamMember {
  return {
    id: index + 1,
    name: officer.name,
    role: officer.title,
    img: renderablePhoto(officer.photo_url, 'officer photo'),
    // The portal does not report image dimensions. These describe the frame the
    // avatar is rendered in rather than the file: the container is a fixed
    // square and the image is `object-cover`, so this fixes the aspect ratio the
    // optimizer works with and prevents layout shift regardless of what was
    // uploaded.
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    accent: ACCENTS[index % ACCENTS.length],
  };
}

/**
 * The portal already guarantees images come only from its own storage, and
 * nulls anything else. This check stays anyway: the guarantee lives in another
 * codebase, and a regression there would otherwise reach visitors as broken
 * images before anyone on this side noticed.
 */
function toEventItem(event: PortalEvent, index: number): EventItem {
  return {
    id: index + 1,
    title: event.title,
    date: formatEventDate(event.start_date, event.end_date),
    category: event.category,
    img: renderablePhoto(event.cover_image_url, 'event cover'),
  };
}

function sortOfficers(officers: PortalOfficer[]): TeamMember[] {
  return [...officers].sort((a, b) => a.display_order - b.display_order).map(toTeamMember);
}

export type LandingContent = {
  officers: TeamMember[];
  events: EventItem[];
  images: LandingImages;
};

/**
 * Everything the landing page renders from the portal, from one request.
 *
 * Each section falls back to its bundled content **independently**: a portal
 * with real officers but no events yet — its state on the day CMS-02 shipped —
 * shows portal officers and the built-in events, rather than all or nothing.
 *
 * An empty list from a healthy portal is treated as a fallback case. A live
 * site with no officers at all is far more likely to be a mistake on the
 * portal's side than an editorial choice, and an empty events carousel looks
 * broken rather than quiet.
 *
 * Events keep the portal's order: undated ("TBA") first, then newest start
 * date first. The portal owns that editorial choice, as it owns officers'
 * `display_order`.
 */
export async function getLandingContent(): Promise<LandingContent> {
  const result = await fetchPortalLanding();
  if (result.status !== 'ok') return { officers: team, events: bundledEvents, images: BUILT_IN_LANDING_IMAGES };

  const { officers, events, images } = result.data;
  return {
    officers: officers.length > 0 ? sortOfficers(officers) : team,
    events: events.length > 0 ? events.map(toEventItem) : bundledEvents,
    // Resolved slot by slot; see lib/portal/landing-images.ts.
    images: resolveLandingImages(images),
  };
}
