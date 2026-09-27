import type { Category } from './events';

/**
 * The badge colour for each event category.
 *
 * Shared by the carousel card and the event's own page (EVENTS-03) so the two
 * cannot drift: a category that looks purple in the carousel and grey on its
 * page reads as a bug to everyone but the person who wrote it.
 *
 * Colours live here rather than in the event data on purpose — an editor
 * changing an event in the portal cannot pick a colour, so every event of a
 * category always matches.
 */
export const EVENT_BADGE_COLORS: Record<Category, string> = {
  hackaton: 'bg-devcon-purple-500 text-white',
  workshop: 'bg-devcon-yellow-500 text-black',
  seminar: 'bg-devcon-purple-700 text-white',
  community: 'bg-devcon-lime-500   text-black',
  career: 'bg-devcon-orange-500  text-white',
};

/**
 * The colour hint on a sub-category chip (EVENTS-07).
 *
 * Sub-categories are deliberately quieter than the main badge — a neutral dark
 * chip — and carry their category's colour only as a small dot. The dot is
 * decorative: the chip's text is white on dark, so contrast never depends on
 * which category it is.
 */
export const EVENT_DOT_COLORS: Record<Category, string> = {
  hackaton: 'bg-devcon-purple-500',
  workshop: 'bg-devcon-yellow-500',
  seminar: 'bg-devcon-purple-700',
  community: 'bg-devcon-lime-500',
  career: 'bg-devcon-orange-500',
};
