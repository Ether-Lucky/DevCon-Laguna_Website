/**
 * officers.ts — turning the portal's officers into what the section renders.
 *
 * Deliberately free of `server-only`, like `format.ts`, so the suite can test
 * these rules directly instead of only through a running page. The portal is a
 * separate deployment with no test data of its own, so a rule that can only be
 * checked end to end effectively cannot be checked at all.
 */

import type { TeamMember } from '@/lib/content/officers';
import type { PortalOfficer } from './types';

/**
 * The portal has no accent colour, so one is assigned by position.
 *
 * Deterministic on purpose: the same officer keeps the same colour across
 * renders and across deployments. Anything random would make the visual
 * regression suite fail on every run for no real reason.
 */
const ACCENTS: TeamMember['accent'][] = ['yellow', 'purple', 'lime', 'orange'];

/**
 * The frame the avatar is drawn in, not the file's own size.
 *
 * The portal does not report image dimensions. The container is a fixed square
 * and the image is `object-cover`, so declaring the frame fixes the aspect ratio
 * the optimizer works with and prevents layout shift whatever was uploaded.
 */
const AVATAR_SIZE = 960;

/**
 * An officer's bio, or undefined when there is nothing worth showing
 * (OFFICER-03).
 *
 * `null`, `""` and `"   "` all mean the same thing to a reader: no bio. They
 * are collapsed here rather than in the component, so the card never has to
 * decide whether whitespace counts as content — and a card with no bio is
 * exactly the card the site had before this feature.
 *
 * A non-string is treated as absent too. The portal types it as `string | null`,
 * but that guarantee lives in another codebase.
 */
export function renderableBio(bio: unknown): string | undefined {
  if (typeof bio !== 'string') return undefined;
  const trimmed = bio.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * One portal officer as the section's card data.
 *
 * `photo` is passed in already checked: the allowlist that decides whether a
 * photo is renderable belongs with the images, not here.
 */
export function toTeamMember(
  officer: PortalOfficer,
  index: number,
  photo: string | undefined,
): TeamMember {
  return {
    id: index + 1,
    name: officer.name,
    role: officer.title,
    img: photo,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    accent: ACCENTS[index % ACCENTS.length],
    bio: renderableBio(officer.bio),
  };
}

/**
 * The portal's officers in the order it asked for, as card data.
 *
 * `display_order` is the portal's editorial choice and is honoured exactly;
 * the accent colours follow the sorted position, so they stay stable as long as
 * the order does.
 */
export function toTeamMembers(
  officers: PortalOfficer[],
  photoFor: (officer: PortalOfficer) => string | undefined,
): TeamMember[] {
  return [...officers]
    .sort((a, b) => a.display_order - b.display_order)
    .map((officer, index) => toTeamMember(officer, index, photoFor(officer)));
}
