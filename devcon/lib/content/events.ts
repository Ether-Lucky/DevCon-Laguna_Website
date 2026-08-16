type Category = "hackaton" | "workshop" | "seminar" | "community" | "career"

interface EventItem {
  id: number;
  title: string;
  date: string;
  category: Category;
  img?: string;
  color: string;
}

const events: EventItem[] = [
  { 
    id: 1, 
    title: 'DevCon Hackathon 2026', 
    date: 'May 10–12, 2026', 
    category: 'hackaton', 
    color: 'bg-[#C0E00B] text-black', 
    img: '/images/hackathon.png' 
  },
  { 
    id: 2, 
    title: 'Web Dev Workshop', 
    date: 'Dec 17, 2025', 
    category: 'workshop', 
    color: 'bg-[#F2C94C] text-black', 
    img: '/images/workshop.png' 
  },
  { 
    id: 3, 
    title: 'Tech Talk: AI in Dev', 
    date: 'Feb 12, 2024', 
    category: 'seminar', 
    color: 'bg-[#6320EE] text-white', 
    img: '/images/techtalk.png' 
  },
  { 
    id: 4, 
    title: 'Community Meetup', 
    date: 'TBA', 
    category: 'community', 
    color: 'bg-devcon-lime text-black' 
  },
  { 
    id: 5, 
    title: 'UI/UX Design Sprint', 
    date: 'TBA', 
    category: 'workshop', 
    color: 'bg-[#F2C94C] text-black' 
  },
  { 
    id: 6, 
    title: 'Career Fair 2026', 
    date: 'TBA', 
    category: 'career', 
    color: 'bg-devcon-orange text-black' 
  },
  { 
    id: 7, 
    title: 'Open Source Day', 
    date: 'TBA', 
    category: 'hackaton', 
    color: 'bg-[#C0E00B] text-black' 
  },
  { 
    id: 8, 
    title: 'AI Bootcamp', 
    date: 'TBA', 
    category: 'seminar', 
    color: 'bg-[#6320EE] text-white' 
  },
  { 
    id: 9, 
    title: 'Demo Night', 
    date: 'TBA', 
    category: 'community', 
    color: 'bg-devcon-lime text-black' 
  },
];

const eventsPerPage = 3;

export type { EventItem }
export { events, eventsPerPage }
