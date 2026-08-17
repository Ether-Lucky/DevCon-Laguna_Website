interface TeamMember {
  id: number;
  name: string;
  role: string;
  img?: string;
  accent: 'yellow' | 'orange' | 'purple' | 'lime';
}

const team: TeamMember[] = [
  { 
    id: 1, 
    name: 'Danmel Laranga', 
    role: 'President', 
    img: '/images/officers/president.png', 
    accent: 'yellow' 
  },
  { 
    id: 2, 
    name: 'Sherwin Limosnero', 
    role: 'Executive Vice President', 
    img: '/images/officers/vice-president.png', 
    accent: 'orange' 
  },
  { 
    id: 3, 
    name: 'Ivy Villarin', 
    role: 'Secretary', 
    img: '/images/officers/secretary.png', 
    accent: 'purple' 
  },
  { 
    id: 4, 
    name: 'Stephanie Rano', 
    role: 'VP for Finance', 
    img: '/images/officers/finance.png', 
    accent: 'lime' 
  },
  { 
    id: 5, 
    name: 'Lucky Guevarra', 
    role: 'VP for Technology', 
    img: '/images/officers/technology.png', 
    accent: 'lime' 
  },
  { 
    id: 6, 
    name: 'Raziel Sevilla', 
    role: 'VP for Memberships', 
    img: '/images/officers/membership.png', 
    accent: 'lime' 
  },
  { 
    id: 7, 
    name: 'Nichole Caraliman', 
    role: 'VP for Communications', 
    img: '/images/officers/communication.png', 
    accent: 'purple' 
  },
  { 
    id: 8, 
    name: 'Andrew Dejito', 
    role: 'VP for Partnerships & Fundraising', 
    img: '/images/officers/partnerships-fundraising.png', 
    accent: 'orange' 
  },
  { 
    id: 9, 
    name: 'Alyssa Marie Valera', 
    role: 'VP for Marketing', 
    img: '/images/officers/marketing.png', 
    accent: 'lime' 
  },
  { 
    id: 10,
    name: 'Kurt Joshua P. Cayaga', 
    role: 'VP for Campus DevCon', 
    img: '/images/officers/campus-devcon.png', 
    accent: 'orange' 
  },
  { 
    id: 11,
     name: 'Emmanuel Benedict Soliveres', 
     role: 'VP for DevCon Kids', 
     img: '/images/officers/devcon-kids.png', 
     accent: 'purple' 
    },
  { 
    id: 12,
    name: 'Zyrus Alvez', 
    role: 'Code Camp & Summit Lead', 
    img: '/images/officers/code-camp-and-summit-lead.png', 
    accent: 'lime' 
  },
];

const membersPerPage = 8;

export type { TeamMember }
export { team, membersPerPage }