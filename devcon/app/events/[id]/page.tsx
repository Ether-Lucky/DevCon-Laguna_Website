import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarIcon, MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getPortalEvent } from '@/lib/portal/content';
import { eventPath } from '@/lib/portal/events';
import { formatEventDate } from '@/lib/portal/format';
import { EVENT_BADGE_COLORS } from '@/lib/content/event-badges';
import { eventDescription, eventJsonLd, eventTitle, eventUrl } from '@/lib/portal/event-seo';
import { siteConfig } from '@/lib/site-config';
import NavBar from '@/components/ui/nav-bar/nav-bar';
import Footer from '@/components/ui/sections/footer';

/**
 * An event's own page (EVENTS-03, #156).
 *
 * The portal has always sent each event's `description` and `location`, and the
 * landing page showed neither: the carousel card has room for a title, a date
 * and a badge. This is where the rest of it lives.
 *
 * **Portal events only.** The bundled events in `lib/content/events.ts` are
 * design placeholders with no description and no location — a page for one would
 * be a title and a date, which is exactly what the card already showed. Their
 * cards stay unlinked.
 *
 * **An unknown id is a 404**, and so is an unreachable portal. A page that
 * cannot show the event it promised is not a page, and a redirect to the
 * homepage would tell a visitor their link worked when it did not.
 *
 * This reads the same cached landing response the homepage uses, so opening an
 * event costs no extra portal request, and a card and the page it links to can
 * never disagree.
 */
/**
 * Per-event metadata (SEO-05, #157).
 *
 * Without this every event page would carry the site's own title and
 * description, so a search result for an event would look exactly like a search
 * result for the homepage — the same problem SEO-04 was raised about.
 *
 * The portal fetch is shared with the page below: Next memoizes `fetch` across
 * `generateMetadata` and the render, so an event page still makes one request.
 *
 * An unknown event returns the defaults rather than throwing; the page renders
 * a 404 a moment later.
 */
export async function generateMetadata({ params }: PageProps<'/events/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const event = await getPortalEvent(id);
  if (!event) return {};

  const url = eventUrl(siteConfig.url, event);
  const description = eventDescription(event);

  return {
    title: eventTitle(event),
    description,
    alternates: { canonical: eventPath(event.id) },
    openGraph: {
      type: 'article',
      title: eventTitle(event),
      description,
      url,
      // The event's own cover where it has one; the site's default share image
      // is inherited from the root layout otherwise.
      ...(event.cover_image_url ? { images: [{ url: event.cover_image_url, alt: event.title }] } : {}),
    },
  };
}

export default async function EventPage({ params }: PageProps<'/events/[id]'>) {
  const { id } = await params;
  const event = await getPortalEvent(id);
  if (!event) notFound();

  const date = formatEventDate(event.start_date, event.end_date);
  const jsonLd = eventJsonLd(event, siteConfig.url, siteConfig.name);

  return (
    <>
      {/* The site's own navbar and footer, as the legal pages have, so an event
          page is part of the site rather than a detour out of it. */}
      {/*
        schema.org Event data, omitted entirely for an event with no date
        (SEO-05). `startDate` is required for search engines to use an Event,
        and inventing one would tell them a date the organisers have not set.
      */}
      {jsonLd ? (
        <script
          type="application/ld+json"
          // Escaping `<` stops a description from closing the script tag early,
          // which would otherwise be an injection vector for text an officer
          // typed into the portal.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '<') }}
        />
      ) : null}
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <Link
          href="/#events"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" aria-hidden />
          Back to events
        </Link>

        <article className="mt-8">
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${EVENT_BADGE_COLORS[event.category]}`}
          >
            {event.category}
          </span>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-foreground leading-tight">
            {event.title}
          </h1>

          <dl className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 text-muted">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Date</dt>
              <CalendarIcon className="w-5 h-5 shrink-0" aria-hidden />
              <dd>{date}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Location</dt>
              <MapPinIcon className="w-5 h-5 shrink-0" aria-hidden />
              <dd>{event.location}</dd>
            </div>
          </dl>

          {event.cover_image_url ? (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-zinc-900">
              {/*
                The alt is the title: a cover image is a picture *of* the event,
                and the heading above already says what that is. Repeating it is
                better than an empty alt on an image this size, and far better
                than "event cover image", which describes the file rather than
                what a reader would miss.
              */}
              <Image
                src={event.cover_image_url}
                alt={event.title}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          ) : null}

          {event.description ? (
            // `whitespace-pre-line` keeps the paragraph breaks an officer typed in
            // the portal's plain-text field. It is not HTML and is not rendered as
            // HTML: whatever is typed there is shown as text.
            <p className="mt-10 text-base md:text-lg leading-relaxed text-foreground whitespace-pre-line">
              {event.description}
            </p>
          ) : null}
        </article>
      </main>
      <Footer />
    </>
  );
}
