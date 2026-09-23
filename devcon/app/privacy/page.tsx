import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalSection } from '@/components/ui/legal/legal-page';
import { siteConfig } from '@/lib/site-config';

/**
 * Privacy Policy (LEGAL-01, #73).
 *
 * Written from what this site actually does, checked against the code. The
 * statements the code cannot settle — controller, contact, retention, consent,
 * response time, minimum age, effective date — were answered and approved by
 * the PM on 2026-09-23 and recorded on #73.
 *
 * Changing any of them changes what the organisation promises its visitors, so
 * a change needs the same approval. Anything newly uncertain should go back to
 * a `<ToConfirm>` marker; `tests/legal.spec.ts` then fails until it is settled.
 *
 * Sources for each section:
 *   Contact form     app/api/contact/route.ts, lib/contact-schema.ts
 *   Spam protection  lib/turnstile.ts (sends the visitor's IP as `remoteip`)
 *   Analytics        docs/analytics.md, lib/analytics-config.ts
 *   Theme            next-themes (browser localStorage only)
 *   Officers         lib/portal/ (published from the DevConnect Portal)
 */

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} handles the personal information you share through this website.`,
  alternates: { canonical: '/privacy' },
};

const list = 'list-disc space-y-2 pl-6';

/**
 * Approved by the PM on 2026-09-23 (#73), together with every answer below.
 * Update this whenever the policy's wording changes.
 */
const LAST_UPDATED = '23 September 2026';

/** The chapter's own mailbox; it already receives the contact form's messages. */
const PRIVACY_CONTACT = 'laguna@devcon.ph';

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p>
        {siteConfig.name} is a chapter of Developers Connect (DevCon) Philippines. This policy
        explains what personal information this website collects, why, who else handles it, and the
        rights you have over it under the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>.
      </p>
      <p>
        This website is informational. It has no user accounts, and it keeps no database of visitors.
        Membership and volunteer sign-ups happen on the{' '}
        <Link href={siteConfig.portalUrl} className="underline underline-offset-4">DevConnect Portal</Link>,
        which has its own privacy policy.
      </p>

      <LegalSection title="Who is responsible for your information">
        <p>
          The personal information controller is <strong>DevCon Laguna</strong>, a chapter of
          Developers Connect (DevCon) Philippines.
        </p>
        <p>
          For privacy questions or requests, email{' '}
          <a href={`mailto:${PRIVACY_CONTACT}`} className="underline underline-offset-4">{PRIVACY_CONTACT}</a>.
        </p>
      </LegalSection>

      <LegalSection title="What we collect, and why">
        <h3 className="text-lg font-semibold text-foreground">When you use the contact form</h3>
        <ul className={list}>
          <li>
            <strong>Your name, email address, subject and message.</strong> We use them only to read
            and reply to your enquiry.
          </li>
          <li>
            The website does not store them. They are sent as an email to {siteConfig.name}&apos;s inbox,
            which is hosted by Google (Gmail). They are kept there for <strong>12 months</strong>, then
            deleted.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-foreground">To keep out spam</h3>
        <ul className={list}>
          <li>
            The contact form uses <strong>Cloudflare Turnstile</strong> to tell people apart from
            automated spam. To do that, Cloudflare processes technical information about your visit,
            such as your <strong>IP address</strong> and browser characteristics. Our server also sends
            your IP address to Cloudflare when it checks the result.
          </li>
          {/*
            Verified 2026-09-22 rather than assumed. On the live site, with the
            widget loaded and talking to challenges.cloudflare.com, the browser
            held no cookies from any domain after 8 seconds. Cloudflare documents
            the only Turnstile cookie, cf_clearance, as set when pre-clearance is
            enabled, which this site does not use. Re-check if pre-clearance is
            ever turned on.
          */}
          <li>Turnstile, as used on this site, does not set cookies.</li>
        </ul>

        <h3 className="text-lg font-semibold text-foreground">To understand how the site is used</h3>
        <ul className={list}>
          <li>
            We use <strong>Vercel Web Analytics</strong>. It is <strong>cookieless</strong>, and it
            doesn&apos;t identify you or follow you across other websites.
          </li>
          <li>
            It records which pages are viewed, the site you came from, your country, and your type of
            device, browser and operating system, in aggregate. It may also record which main buttons
            are clicked (for example &ldquo;Join Us&rdquo;), and that a contact message was sent. It
            does not record what the message says.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-foreground">When the website is delivered to you</h3>
        <ul className={list}>
          <li>
            Our hosting provider, <strong>Vercel</strong>, processes your IP address and basic request
            details to deliver the site and to keep it secure, as any web host does.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-foreground">Stored only on your device</h3>
        <ul className={list}>
          <li>
            Your choice of light or dark theme is saved in your browser&apos;s local storage so the site
            remembers it. It is never sent to us.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Information about our officers">
        <p>
          The &ldquo;Meet Our Officers&rdquo; section shows officers&apos; names, positions and photos,
          managed through the DevConnect Portal. Officers are told when they take up a role that these
          appear on this website, and can ask for their photo or their entry to be removed at any time
          by emailing{' '}
          <a href={`mailto:${PRIVACY_CONTACT}`} className="underline underline-offset-4">{PRIVACY_CONTACT}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          This website does not set cookies. Analytics is cookieless, spam protection runs without
          cookies, and your theme preference is kept in local storage on your device.
        </p>
      </LegalSection>

      <LegalSection title="Who else handles your information">
        <p>We use these service providers, only for the purposes above:</p>
        <ul className={list}>
          <li><strong>Vercel</strong>: hosting and analytics</li>
          <li><strong>Cloudflare</strong>: spam protection on the contact form</li>
          <li><strong>Google</strong>: the email inbox that receives contact form messages</li>
        </ul>
        <p>
          These providers may process information on servers outside the Philippines. We do not sell
          your personal information, and we do not share it for advertising.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>Under the Data Privacy Act, you have the right to:</p>
        <ul className={list}>
          <li>be informed about how your personal information is processed</li>
          <li>access the personal information we hold about you</li>
          <li>have inaccurate information corrected</li>
          <li>object to processing, and have your information erased or blocked</li>
          <li>obtain a copy of your information in a portable format</li>
          <li>be indemnified for damages caused by unlawful processing</li>
          <li>
            file a complaint with the <strong>National Privacy Commission</strong> (privacy.gov.ph)
          </li>
        </ul>
        <p>
          To exercise any of these rights, use the privacy contact in &ldquo;Who is responsible for your
          information&rdquo; above. We will respond within <strong>15 working days</strong>.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          The contact form is meant for people aged <strong>18 and over</strong>, including parents and
          guardians enquiring about programmes such as DevCon Kids. If you are under 18, please ask a
          parent or guardian to contact us for you. If we receive a message that a child has sent us,
          we delete it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          If this policy changes, the updated version will be published on this page with a new
          &ldquo;Last updated&rdquo; date.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
