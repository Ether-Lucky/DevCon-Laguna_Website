/**
 * stats.ts — content data for the impact stats strip on the homepage.
 *
 * Update this file when the organization wants to revise its headline metrics,
 * such as volunteer totals, event counts, reach, or partner numbers.
 *
 * Keep the exported `stats` array shape stable so the UI can render each card
 * consistently without requiring component changes.
 */

/**
 * Represents the SVG asset used by a stat card.
 *
 * @property link   - Public path to the icon file in `public/`.
 * @property width  - Original icon width in pixels.
 * @property height - Original icon height in pixels.
 */
interface Icon {
  link: string;
  width: number;
  height: number;
}

/**
 * Represents a single stat card rendered in the homepage overview section.
 *
 * @property name  - The short label shown beneath the numeric value.
 * @property value - The numeric value displayed in the stat card.
 * @property icon  - Visual asset used with the stat.
 */
interface Stat {
  name: string;
  value: number;
  icon: Icon;
}

const stats: Stat[] = [
  {
    name: 'Community Volunteers',
    value: 500,
    icon: {
      link: '/stat/people.svg',
      width: 75,
      height: 59,
    },
  },
  {
    name: 'Events Organized',
    value: 30,
    icon: {
      link: '/stat/calendar.svg',
      width: 55,
      height: 65.39,
    },
  },
  {
    name: 'Community Reached',
    value: 100,
    icon: {
      link: '/stat/map.svg',
      width: 66,
      height: 63.83,
    },
  },
  {
    name: 'Industry Partners',
    value: 20,
    icon: {
      link: '/stat/shake-hands.svg',
      width: 102.73,
      height: 65.39,
    },
  },
];

export { stats };