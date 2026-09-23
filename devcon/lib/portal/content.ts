import 'server-only';

import { team, type TeamMember } from '@/lib/content/officers';
import { events as bundledEvents, type EventItem } from '@/lib/content/events';
import { isAllowedRemoteImage } from '@/lib/remote-images';
import { fetchPortalLanding } from './client';
import { upcomingEvents } from './format';
import { findEvent, toEventItem } from './events';
import { toTeamMembers } from './officers';
import { BUILT_IN_LANDING_IMAGES, resolveLandingImages, type LandingImages } from './landing-images';
import type { PortalEvent } from './types';

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
 * A remote image, or undefined when it cannot be rendered.
 *
 * A missing photo is a supported state — the officer card shows initials, an
 * event card shows a branded placeholder. A photo on a host `next/image` will
 * not optimise is not: the optimiser answers 400 and the visitor sees a broken
 * image. That happened in production, when the portal held officers whose
 * photos were linked from Tenor rather than uploaded. Treating an unrenderable
 * URL as no photo turns that into initials.
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
 *
 * **Past events are filtered out** (EVENTS-02): the section is about what is
 * coming up. The filter is `upcomingEvents` in `lib/portal/format.ts` and is
 * applied to the portal's events only. The bundled list is design placeholder
 * content shown while the portal has no events at all — filtering it would
 * leave six placeholder "TBA" cards, which is worse than the placeholder set it
 * was drawn with. Once the portal has events, the bundled list is never shown
 * again.
 *
 * If the portal has events but none of them are upcoming, the section shows an
 * empty state rather than reviving the placeholders or listing past events.
 */
export async function getLandingContent(): Promise<LandingContent> {
  const result = await fetchPortalLanding();
  if (result.status !== 'ok') return { officers: team, events: bundledEvents, images: BUILT_IN_LANDING_IMAGES };

  const { officers, events, images } = result.data;
  return {
    officers:
      officers.length > 0
        ? toTeamMembers(officers, (officer) => renderablePhoto(officer.photo_url, 'officer photo'))
        : team,
    events:
      events.length > 0
        ? upcomingEvents(events).map((event, index) =>
            toEventItem(event, index, renderablePhoto(event.cover_image_url, 'event cover')),
          )
        : bundledEvents,
    // Resolved slot by slot; see lib/portal/landing-images.ts.
    images: resolveLandingImages(images),
  };
}

/**
 * One event, for its own page (EVENTS-03).
 *
 * Reads the same cached landing response the homepage uses, so opening an event
 * costs no extra portal request, and an event shown on a card and the page it
 * links to can never disagree.
 *
 * Undefined means "no page to show", whether the id is unknown, the portal is
 * unreachable, or the portal is not configured at all. The caller turns that
 * into a 404 — the alternative is a page promising an event it cannot display.
 *
 * Past events are **not** filtered here, unlike the section. A link to an event
 * that has just finished should still open, or every shared link dies at
 * midnight; it is the carousel's job to be about what is coming up.
 */
export async function getPortalEvent(id: string): Promise<PortalEvent | undefined> {
  const result = await fetchPortalLanding();
  if (result.status !== 'ok') return undefined;
  return findEvent(result.data.events, id);
}
