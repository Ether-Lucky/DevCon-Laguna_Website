/**
 * officers.ts — content data for the "Meet Our Officers" section.
 *
 * To add a new officer: append an entry to `team` with the next available `id`.
 * To update an existing officer: find by `id` and edit the relevant fields.
 * Images should be placed in `public/images/officers/` at 960×960 or 1200×1200 px.
 */

/**
 * Represents a single team member / officer.
 *
 * @property id     - Unique numeric identifier. Must not be duplicated.
 * @property name   - Full display name.
 * @property role   - Position title (e.g. "VP for Technology").
 * @property img    - Optional path to a photo in `public/images/officers/`.
 *                    When omitted, initials are shown inside the avatar circle.
 * @property width  - Intrinsic image width (px) used by next/image for layout.
 * @property height - Intrinsic image height (px) used by next/image for layout.
 * @property accent - Controls the gradient accent on the avatar circle.
 *                    Maps to a Tailwind `to-devcon-*` color in `TeamCard`.
 *                    Allowed values: 'yellow' | 'orange' | 'purple' | 'lime'
 */
interface TeamMember {
  id: number;
  name: string;
  role: string;
  img?: string;
  width: number,
  height: number,
  accent: 'yellow' | 'orange' | 'purple' | 'lime';
}

const team: TeamMember[] = [
  { 
    id: 1, 
    name: 'Danmel Laranga', 
    role: 'President', 
    img: '/images/officers/president.png', 
    width: 960,
    height: 960,
    accent: 'yellow'
  },
  { 
    id: 2, 
    name: 'Sherwin Limosnero', 
    role: 'Executive Vice President', 
    img: '/images/officers/vice-president.png', 
    width: 960,
    height: 960,
    accent: 'orange' 
  },
  { 
    id: 3, 
    name: 'Ivy Villarin', 
    role: 'Secretary', 
    img: '/images/officers/secretary.png', 
    width: 960,
    height: 960,
    accent: 'purple' 
  },
  { 
    id: 4, 
    name: 'Stephanie Rano', 
    role: 'VP for Finance', 
    img: '/images/officers/finance.png', 
    width: 960,
    height: 960,
    accent: 'lime' 
  },
  { 
    id: 5, 
    name: 'Lucky Guevarra', 
    role: 'VP for Technology', 
    img: '/images/officers/technology.png', 
    width: 960,
    height: 960,
    accent: 'lime' 
  },
  { 
    id: 6, 
    name: 'Raziel Sevilla', 
    role: 'VP for Memberships', 
    img: '/images/officers/membership.png', 
    width: 960,
    height: 960,
    accent: 'yellow' 
  },
  { 
    id: 7, 
    name: 'Nichole Caraliman', 
    role: 'VP for Communications', 
    img: '/images/officers/communication.png', 
    width: 960,
    height: 960,
    accent: 'purple' 
  },
  { 
    id: 8, 
    name: 'Andrew Dejito', 
    role: 'VP for Partnerships & Fundraising', 
    img: '/images/officers/partnerships-fundraising.png', 
    width: 960,
    height: 960,
    accent: 'orange' 
  },
  { 
    id: 9, 
    name: 'Alyssa Marie Valera', 
    role: 'VP for Marketing', 
    img: '/images/officers/marketing.png', 
    width: 1200,
    height: 1200,
    accent: 'lime' 
  },
  { 
    id: 10,
    name: 'Kurt Joshua P. Cayaga', 
    role: 'VP for Campus DevCon', 
    img: '/images/officers/campus-devcon.png', 
    width: 1200,
    height: 1200,
    accent: 'purple' 
  },
  { 
    id: 11,
     name: 'Emmanuel Benedict Soliveres', 
     role: 'VP for DevCon Kids', 
     img: '/images/officers/devcon-kids.png', 
     width: 1200,
     height: 1200,
     accent: 'yellow' 
    },
  { 
    id: 12,
    name: 'Zyrus Alvez', 
    role: 'Code Camp & Summit Lead', 
    img: '/images/officers/code-camp-and-summit-lead.png', 
    width: 1200,
    height: 1200,
    accent: 'lime' 
  },
];

const membersPerPage = 8;

export type { TeamMember }
export { team, membersPerPage }