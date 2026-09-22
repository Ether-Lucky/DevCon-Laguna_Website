import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalSection } from '@/components/ui/legal/legal-page';
import ToConfirm from '@/components/ui/legal/to-confirm';
import { siteConfig } from '@/lib/site-config';

/**
 * Privacy Policy (LEGAL-01, #73).
 *
 * DRAFT. Written from what this site actually does, checked against the code,
 * and pending review by DevCon Laguna / DevCon national. Every statement the
 * code can't settle is a `<ToConfirm>` placeholder, and
 * `tests/legal.spec.ts` fails while any remains, so this page can't pass CI
 * until the organisation has filled them in. Not legal advice.
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

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={<ToConfirm>effective date</ToConfirm>}>
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
          The personal information controller is <ToConfirm>legal name of the controller: DevCon Laguna, or DevCon Philippines on the chapter&apos;s behalf</ToConfirm>.
        </p>
        <p>
          For privacy questions or requests, contact <ToConfirm>privacy contact, e.g. an email address the chapter controls, and the Data Protection Officer if one is designated</ToConfirm>.
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
            which is hosted by Google (Gmail). They are kept there for{' '}
            <ToConfirm>how long enquiries are kept, and when they are deleted</ToConfirm>.
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
          managed through the DevConnect Portal. <ToConfirm>how officers consent to their name and photo being published, and how they can ask for either to be removed</ToConfirm>.
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
          information&rdquo; above. We will respond within <ToConfirm>response time the chapter commits to</ToConfirm>.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          The contact form is meant for adults, including parents and guardians enquiring about
          programmes such as DevCon Kids. <ToConfirm>minimum age for using the contact form, and how information from a child sent in error is handled</ToConfirm>.
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
