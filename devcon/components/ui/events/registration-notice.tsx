import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

/**
 * RegistrationNotice — how to take part in an upcoming event (EVENTS-08).
 *
 * Registration happens in the DevConnect Portal and needs an approved member
 * account. The portal team asked the site to "say so plainly and link to Join
 * DevCon first", so:
 *
 * 1. **Join DevCon Laguna** leads — most visitors reading a public event page
 *    are not members yet, and a login screen would be a dead end for them.
 * 2. **Register in the portal** follows, for members. It opens this event in
 *    the portal, behind sign-in, where they register.
 *
 * When the portal ships its planned public event page, this becomes a single
 * "Register" button — the only place that needs to change.
 *
 * Both links leave the site, so they open in a new tab with a safe `rel`, and
 * say so to a screen reader.
 */
export default function RegistrationNotice({
  joinUrl,
  eventUrl,
}: {
  joinUrl: string;
  eventUrl: string;
}) {
  return (
    <aside
      data-registration-notice
      aria-labelledby="registration-heading"
      className="mt-12 rounded-[28px] p-6 md:p-8 bg-foreground/[0.04] ring-1 ring-foreground/10"
    >
      <h2 id="registration-heading" className="text-xl md:text-2xl font-bold text-foreground">
        Want to take part?
      </h2>
      <p className="mt-3 text-base leading-relaxed text-foreground/90">
        Registration is for DevCon Laguna members, through the DevConnect Portal. New members join
        first; once approved, you can register for any event there.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider bg-devcon-lime-500 text-black hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-devcon-purple-500"
        >
          Join DevCon Laguna
          <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden />
          <span className="sr-only">(opens the DevConnect Portal in a new tab)</span>
        </a>
        <a
          href={eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider text-foreground ring-1 ring-foreground/30 hover:bg-foreground/5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-devcon-purple-500"
        >
          Already a member? Register
          <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden />
          <span className="sr-only">(opens this event in the DevConnect Portal, in a new tab)</span>
        </a>
      </div>
    </aside>
  );
}
