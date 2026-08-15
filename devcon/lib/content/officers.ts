interface TeamMember {
  id: number;
  name: string;
  role: string;
  img: string;
  gradient: string;
}

const team: TeamMember[] = [
  { 
    id: 1, 
    name: 'Danmel Laranga', 
    role: 'President', 
    img: '/images/officers/president.png', 
    gradient: 'from-transparent from-10% to-[#F0C419]' 
  },
  { 
    id: 2, 
    name: 'Sherwin Limosnero', 
    role: 'Executive Vice President', 
    img: '/images/officers/vice-president.png', 
    gradient: 'from-transparent from-15% to-[#F2801E]' 
  },
  { 
    id: 3, 
    name: 'Ivy Villarin', 
    role: 'Secretary', 
    img: '/images/officers/secretary.png', 
    gradient: 'from-transparent from-20% to-[#6A0DF2]' 
  },
  { 
    id: 4, 
    name: 'Stephanie Rano', 
    role: 'VP for Finance', 
    img: '/images/officers/finance.png', 
    gradient: 'from-transparent from-18% to-[#96AE01]' 
  },
  { 
    id: 5, 
    name: 'Lucky Guevarra', 
    role: 'VP for Technology', 
    img: '/images/officers/technology.png', 
    gradient: 'from-transparent from-18% to-[#96AE01]' 
  },
  { 
    id: 6, 
    name: 'Raziel Sevilla', 
    role: 'VP for Memberships', 
    img: '/images/officers/membership.png', 
    gradient: 'from-transparent from-20% to-[#6A0DF2]' 
  },
  { 
    id: 7, 
    name: 'Nichole Caraliman', 
    role: 'VP for Communications', 
    img: '/images/officers/communication.png', 
    gradient: 'from-transparent from-15% to-[#F2801E]' 
  },
  { 
    id: 8, 
    name: 'Andrew Dejito', 
    role: 'VP for Partnerships & Fundraising', 
    img: '/images/officers/partnerships-fundraising.png', 
    gradient: 'from-transparent from-10% to-[#F0C419]' 
  },
  { 
    id: 9, 
    name: 'Alyssa Marie Valera', 
    role: 'VP for Marketing', 
    img: '/images/officers/marketing.png', 
    gradient: 'from-devcon-black to-[#C0E00B]' 
  },
  { 
    id: 10,
    name: 'Kurt Joshua P. Cayaga', 
    role: 'VP for Campus DevCon', 
    img: '/images/officers/campus-devcon.png', 
    gradient: 'from-devcon-black to-[#F2801E]' 
  },
  { 
    id: 11,
     name: 'Emmanuel Benedict Soliveres', 
     role: 'VP for DevCon Kids', 
     img: '/images/officers/devcon-kids.png', 
     gradient: 'from-devcon-black to-devcon-purple-bright' 
    },
  { 
    id: 12,
    name: 'Zyrus Alvez', 
    role: 'Code Camp & Summit Lead', 
    img: '/images/officers/code-camp-and-summit-lead.png', 
    gradient: 'from-devcon-black to-[#4A5D23]' 
  },
];

const membersPerPage = 8;

export { team, membersPerPage }
export type { TeamMember }