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
