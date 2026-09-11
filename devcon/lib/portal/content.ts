import 'server-only';

import { team, type TeamMember } from '@/lib/content/officers';
import { fetchPortalLanding } from './client';
import type { PortalOfficer } from './types';

const ACCENTS = ['yellow', 'orange', 'purple', 'lime'] as const;
const AVATAR_SIZE = 960;

function toTeamMember(officer: PortalOfficer, index: number): TeamMember {
  return {
    id: index + 1,
    name: officer.name,
    role: officer.title,
    img: officer.photo_url ?? undefined,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    accent: ACCENTS[index % ACCENTS.length],
  };
}

export async function getOfficers(): Promise<TeamMember[]> {
  const result = await fetchPortalLanding();
  if (result.status !== 'ok' || result.data.officers.length === 0) return team;

  return [...result.data.officers]
    .sort((a, b) => a.display_order - b.display_order)
    .map(toTeamMember);
}
