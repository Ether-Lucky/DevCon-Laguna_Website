import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalSection } from '@/components/ui/legal/legal-page';
import { siteConfig } from '@/lib/site-config';

/**
 * Terms and Conditions (LEGAL-01, #73).
 *
 * Approved by the PM on 2026-09-23 (#73), together with the Privacy Policy.
 * The same rule applies: anything newly uncertain goes back to a `<ToConfirm>`
 * marker, and `tests/legal.spec.ts` fails until it is settled.
 */

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: `The terms for using the ${siteConfig.name} website.`,
  alternates: { canonical: '/terms' },
};

const list = 'list-disc space-y-2 pl-6';

/** Kept in step with the Privacy Policy: both were approved together. */
const LAST_UPDATED = '23 September 2026';
const CONTACT = 'laguna@devcon.ph';

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" lastUpdated={LAST_UPDATED}>
      <p>
        These terms cover your use of the {siteConfig.name} website. By using the site, you agree to
        them. If you don&apos;t agree, please don&apos;t use the site.
      </p>

      <LegalSection title="About this website">
        <p>
          This site shares information about {siteConfig.name}, a chapter of Developers Connect (DevCon)
          Philippines: our community, officers, programmes and events. It is provided for general
          information only.
        </p>
        <p>
          <strong>Event details can change.</strong> Dates, venues and programmes are shown as announced,
          and may be updated or cancelled. Please check our official announcements before you travel or
          make plans.
        </p>
      </LegalSection>

      <LegalSection title="Using the contact form">
        <p>When you send us a message, please don&apos;t:</p>
        <ul className={list}>
          <li>send spam, advertising or automated messages</li>
          <li>send anything unlawful, abusive, harassing or defamatory</li>
          <li>impersonate someone else, or share someone else&apos;s personal information without their permission</li>
          <li>try to disrupt, overload or get around the form&apos;s protections</li>
        </ul>
        <p>
          We may ignore or block messages that break these rules. How we handle what you send is covered
          in our <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Membership and the DevConnect Portal">
        <p>
          Joining DevCon, volunteering and managing a membership all happen on the{' '}
          <Link href={siteConfig.portalUrl} className="underline underline-offset-4">DevConnect Portal</Link>,
          which has its own terms. Buttons such as &ldquo;Join Us&rdquo; and &ldquo;Volunteer&rdquo; take
          you there.
        </p>
      </LegalSection>

      <LegalSection title="Content and trademarks">
        <p>
          The DevCon and {siteConfig.name} names and logos, and the site&apos;s design, text and photos,
          belong to their respective owners: the <strong>DevCon</strong> name and logo to Developers
          Connect (DevCon) Philippines, and this site&apos;s content and photographs to{' '}
          {siteConfig.name}. You may share links to the site. You may not reuse its logos or content in
          a way that suggests our endorsement without permission.
        </p>
      </LegalSection>

      <LegalSection title="Links to other websites">
        <p>
          The site links to other websites, such as the DevConnect Portal and our social media pages. We
          don&apos;t control those sites and aren&apos;t responsible for their content or practices.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          We work to keep the site accurate and available, but it is provided &ldquo;as is&rdquo;. We
          don&apos;t guarantee it will always be available, error-free or up to date.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the extent the law allows, {siteConfig.name} is not liable for any loss arising from your use
          of the site or reliance on its content.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of the Republic of the Philippines.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          We may update these terms. The current version is always on this page, with its
          &ldquo;Last updated&rdquo; date.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms: email{' '}
          <a href={`mailto:${CONTACT}`} className="underline underline-offset-4">{CONTACT}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
