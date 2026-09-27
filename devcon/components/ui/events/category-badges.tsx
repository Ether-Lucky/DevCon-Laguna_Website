import type { ReactNode } from 'react';
import type { Category } from '@/lib/content/events';
import { EVENT_BADGE_COLORS, EVENT_DOT_COLORS } from '@/lib/content/event-badges';

export type CategoryLabel = { name: string; category: Category };

/**
 * CategoryBadges — an event's categories, the primary one leading (EVENTS-07).
 *
 * The portal sends every category an event has, primary first, each with the
 * officers' own name for it ("Code Camp") and the one of our five keys it maps
 * to. The PM wanted all of them shown, with the relationship visible:
 *
 * - **the main badge** is the primary category, in its full colour, under its
 *   own name — so the Code Camp reads "Code Camp", not "Seminar";
 * - **sub-categories** follow as quieter neutral chips, each with a small dot of
 *   its colour, so they read as secondary at a glance.
 *
 * Used by the carousel card and the event page, so the two cannot drift.
 *
 * `maxSubs` caps the chips on a card, where the row sits over an image and
 * space is short; the rest collapse into "+N". The event page shows them all.
 *
 * `trailing` is for anything that belongs in the same row — the card's
 * "Past event" marker — so the row wraps as one unit.
 */
export default function CategoryBadges({
  labels,
  fallback,
  maxSubs,
  trailing,
}: {
  labels?: CategoryLabel[];
  /** The single category to show when there is no list (the bundled placeholders). */
  fallback: Category;
  maxSubs?: number;
  trailing?: ReactNode;
}) {
  const all = labels && labels.length > 0 ? labels : [{ name: fallback, category: fallback }];
  const [main, ...subs] = all;
  const shown = maxSubs === undefined ? subs : subs.slice(0, maxSubs);
  const hidden = subs.length - shown.length;

  return (
    <div className="flex flex-wrap items-center gap-2" data-event-categories>
      <span
        data-category-main
        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${EVENT_BADGE_COLORS[main.category]}`}
      >
        {main.name}
      </span>

      {shown.map((sub) => (
        <span
          key={sub.name}
          data-category-sub
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider bg-black/60 text-white ring-1 ring-white/25"
        >
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${EVENT_DOT_COLORS[sub.category]}`} />
          {sub.name}
        </span>
      ))}

      {hidden > 0 ? (
        <span
          data-category-more
          className="px-2.5 py-1 rounded-full text-[0.7rem] font-semibold bg-black/60 text-white ring-1 ring-white/25"
        >
          {/* "+2" means nothing read aloud; the hidden text says what it counts. */}
          <span aria-hidden>+{hidden}</span>
          <span className="sr-only">
            and {hidden} more {hidden === 1 ? 'category' : 'categories'}
          </span>
        </span>
      ) : null}

      {trailing}
    </div>
  );
}
