import 'server-only';

import { team, type TeamMember } from '@/lib/content/officers';
import { isAllowedRemoteImage } from '@/lib/remote-images';
import { fetchPortalLanding } from './client';
import type { PortalOfficer } from './types';

/**
 * Landing page content, sourced from the DevConnect Portal with the bundled
 * files as the fallback (CMS-03).
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
function renderablePhoto(url: string | null): string | undefined {
  if (!url) return undefined;
  if (isAllowedRemoteImage(url)) return url;
  console.warn(`[portal] officer photo on a host we cannot render, showing initials: ${url}`);
  return undefined;
}

function toTeamMember(officer: PortalOfficer, index: number): TeamMember {
  return {
    id: index + 1,
    name: officer.name,
    role: officer.title,
    img: renderablePhoto(officer.photo_url),
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
 * Officers for the "Meet Our Officers" section.
 *
 * Falls back to the bundled list when the portal is unconfigured, unreachable,
 * or returns nothing usable. An empty array from a healthy portal is treated as
 * a fallback case too: a live site with no officers at all is far more likely to
 * be a mistake on the portal's side than a deliberate editorial choice.
 */
export async function getOfficers(): Promise<TeamMember[]> {
  const result = await fetchPortalLanding();
  if (result.status !== 'ok' || result.data.officers.length === 0) return team;

  return [...result.data.officers]
    .sort((a, b) => a.display_order - b.display_order)
    .map(toTeamMember);
}
