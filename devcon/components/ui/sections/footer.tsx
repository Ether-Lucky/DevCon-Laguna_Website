import Link from 'next/link';
import { footerColumns, footerLegalLinks } from '@/lib/content/footer';
import Logo from '../logo';
import SocialMedia from './social-media';

/**
 * Footer — the site-wide footer.
 *
 * The `id="contact"` anchor moved to the Contact section (CON-01): the nav
 * "Contact" link should land on the form, not below it.
 *
 * Structure:
 * - Main content: the link columns from `lib/content/footer.ts` and the social
 *   media links.
 * - Bottom bar: copyright, legal links, and the chapter logo.
 * - Footer logos pass `onDark` so they remain readable in light mode.
 *
 * The purple gradient background (`from-background via-devcon-purple-500/50 to-devcon-purple-500`)
 * creates a gradual color transition from the page background into the brand purple footer.
 *
 * Every link goes somewhere that exists (FOOTER-02). The footer shipped with 17
 * links pointing at `"#"`, including "Privacy Policy" and "Terms and
 * Conditions". Links with no destination were removed rather than left
 * dangling, and a test fails the build if any `href="#"` returns.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-background to-devcon-purple-500/80 text-foreground pt-16 pb-8 px-4 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:gap-16">
        
        {/* Main Footer Content */}
        <div className="flex flex-col justify-between gap-10 md:flex-row md:gap-12">
          
          <div className="flex flex-col md:w-1/3">
            
            {/* DevCon Laguna Logo Component */}
            <div className="mb-5 hidden self-end md:mb-6 md:block md:self-start">
              <Logo />
            </div>

            <p className="mb-6 hidden max-w-sm text-sm font-light text-foreground sm:text-base md:block">Empowering the next generation of developers through innovation, collaboration, and community.</p>

            {/* Integrated Social Media Component */}
            <SocialMedia color="text-foreground" compact />
          </div>

          <div className="grid grid-cols-2 gap-x-7 gap-y-9 md:mt-0 md:w-2/3 md:grid-cols-3 md:gap-8">
            {footerColumns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-3">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground">{column.heading}</h3>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div>
          <hr className="mb-6 border-t border-white/25" />

          <div className="flex flex-col gap-3 text-xs font-normal text-white/65 sm:text-sm md:flex-row md:items-center md:justify-between">
            <p className="leading-5">© 2026 DEVCON Laguna <span className="mx-1 text-white/35">|</span> All Rights Reserved</p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              {footerLegalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="underline transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </p>
            <div className="self-end md:hidden">
              <Logo onDark />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}