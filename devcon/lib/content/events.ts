/**
 * events.ts — content data for the Featured Events section.
 *
 * IMPORTANT: Do NOT add a `color` field to events. Badge colors are
 * centrally managed in `components/ui/sections/events.tsx` via `categoryColors`.
 * All events of the same category will always share the same color automatically.
 *
 * To add or edit events, update the `events` array below.
 * To change a category's badge color, edit `categoryColors` in `events.tsx`.
 */

/** All valid event category identifiers. */
type Category = "hackaton" | "workshop" | "seminar" | "community" | "career"

/**
 * Represents a single event entry.
 *
 * @property id       - Unique numeric identifier. Must not be duplicated.
 * @property title    - Display title of the event.
 * @property date     - Human-readable date string (e.g. "May 10–12, 2026" or "TBA").
 * @property category - Determines the badge color via `categoryColors` in `events.tsx`.
 * @property img      - Optional path to an event image in `public/`. Omit for placeholder.
 */
interface EventItem {
  id: number;
  title: string;
  date: string;
  category: Category;
  img?: string;
}

const events: EventItem[] = [
  { 
    id: 1, 
    title: 'DevCon Hackathon 2026', 
    date: 'May 10–12, 2026', 
    category: 'hackaton', 
    img: '/images/hackathon.png' 
  },
  { 
    id: 2, 
    title: 'Web Dev Workshop', 
    date: 'Dec 17, 2025', 
    category: 'workshop', 
    img: '/images/workshop.png' 
  },
  { 
    id: 3, 
    title: 'Tech Talk: AI in Dev', 
    date: 'Feb 12, 2024', 
    category: 'seminar', 
    img: '/images/techtalk.png' 
  },
  { 
    id: 4, 
    title: 'Community Meetup', 
    date: 'TBA', 
    category: 'community', 
  },
  { 
    id: 5, 
    title: 'UI/UX Design Sprint', 
    date: 'TBA', 
    category: 'workshop', 
  },
  { 
    id: 6, 
    title: 'Career Fair 2026', 
    date: 'TBA', 
    category: 'career', 
  },
  { 
    id: 7, 
    title: 'Open Source Day', 
    date: 'TBA', 
    category: 'hackaton', 
  },
  { 
    id: 8, 
    title: 'AI Bootcamp', 
    date: 'TBA', 
    category: 'seminar', 
  },
  { 
    id: 9, 
    title: 'Demo Night', 
    date: 'TBA', 
    category: 'community', 
  },
];

const eventsPerPage = 3;

export type { EventItem, Category }
export { events, eventsPerPage }
