/**
 * Turns the portal's event dates into the label on an event card.
 *
 * The portal sends ISO timestamps in UTC; the card shows "May 10–12, 2026".
 *
 * **Formatted in Philippine time, explicitly.** Vercel's servers run in UTC, so
 * formatting without a time zone would put an evening event in Laguna on the
 * next day's date — 20:00Z is 04:00 the following morning in Manila. The events
 * happen in Laguna, so that is the calendar a visitor expects.
 *
 * Built from date parts rather than `Intl.DateTimeFormat#formatRange`, whose
 * spacing and dash characters vary between ICU versions. A label that changed
 * with the Node version would be a label the visual regression suite could not
 * hold still.
 *
 * Deliberately free of `server-only` so the test suite can check it directly.
 */

import type { PortalEvent } from './types';

export const EVENT_TIME_ZONE = 'Asia/Manila';

/** Shown for an event the portal has published without a date. */
export const TBA_LABEL = 'TBA';

type DateParts = { year: number; month: string; monthIndex: number; day: number };

const monthName = new Intl.DateTimeFormat('en-US', { timeZone: EVENT_TIME_ZONE, month: 'short' });
const numeric = new Intl.DateTimeFormat('en-US', {
  timeZone: EVENT_TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

function partsOf(iso: string): DateParts {
  const date = new Date(iso);
  const pick = (type: string) =>
    Number(numeric.formatToParts(date).find((part) => part.type === type)?.value);
  return { year: pick('year'), monthIndex: pick('month'), day: pick('day'), month: monthName.format(date) };
}

export function formatEventDate(start: string | null, end: string | null): string {
  if (!start && !end) return TBA_LABEL;

  const from = partsOf((start ?? end)!);
  const to = partsOf((end ?? start)!);

  const sameYear = from.year === to.year;
  const sameMonth = sameYear && from.monthIndex === to.monthIndex;
  const sameDay = sameMonth && from.day === to.day;

  if (sameDay) return `${from.month} ${from.day}, ${from.year}`;
  // En dash with no spaces inside a month, spaced en dash across months —
  // the same style as the dates the section shipped with ("May 10–12, 2026").
  if (sameMonth) return `${from.month} ${from.day}–${to.day}, ${from.year}`;
  if (sameYear) return `${from.month} ${from.day} – ${to.month} ${to.day}, ${from.year}`;
  return `${from.month} ${from.day}, ${from.year} – ${to.month} ${to.day}, ${to.year}`;
}

/**
 * Whether an event still belongs on the landing page (EVENTS-02).
 *
 * "Featured Events" is about what is coming up, so an event drops off once it
 * is over. Undated ("TBA") events always stay: they have not happened yet.
 *
 * **Judged by the end of the event's day in Philippine time**, not by the
 * timestamp itself. The portal stores whole-day events at midnight UTC, which
 * is 08:00 in Manila, so comparing instants would drop a one-day event from the
 * page at breakfast time on the day it runs. An event stays until midnight
 * Manila at the end of its last day.
 */
export function isUpcoming(
  event: { start_date: string | null; end_date: string | null },
  now: Date = new Date(),
): boolean {
  const ends = event.end_date ?? event.start_date;
  if (!ends) return true; // TBA

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: EVENT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(ends));

  // en-CA gives YYYY-MM-DD. +08:00 is Philippine Standard Time, which has no
  // daylight saving, so the offset is constant.
  const endOfDay = new Date(`${parts}T23:59:59.999+08:00`);
  return endOfDay.getTime() >= now.getTime();
}

/**
 * The events the "Featured Events" section should show, in the order the portal
 * sent them (EVENTS-02).
 *
 * Order is deliberately left alone: the portal returns undated ("TBA") events
 * first, then newest start date first, and that editorial choice is the
 * portal's — ours is only to decide what is still coming up.
 *
 * `content.ts` applies this to the portal's events only: the bundled list is
 * placeholder content shown while the portal has no events at all, and
 * filtering it would leave six placeholder "TBA" cards.
 */
export function upcomingEvents(events: PortalEvent[]): PortalEvent[] {
  // The lambda matters: passed bare, filter() would feed the array index into
  // isUpcoming's `now` parameter.
  return events.filter((event) => isUpcoming(event));
}
