import Link from 'next/link';
import Logo from '../logo';
import SocialMedia from './social-media';

/**
 * Footer — the site-wide footer.
 *
 * The `id="contact"` anchor moved to the Contact section (CON-01): the nav
 * "Contact" link should land on the form, not below it.
 *
 * Structure:
 * - Main content: four link groups and the social media links.
 * - Bottom bar: copyright, legal links, and the chapter logo.
 * - Footer logos pass `onDark` so they remain readable in light mode.
 *
 * The purple gradient background (`from-background via-devcon-purple-500/50 to-devcon-purple-500`)
 * creates a gradual color transition from the page background into the brand purple footer.
 *
 * Link `href` values are currently `"#"` placeholders — update them as pages are built.
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

          <div className="grid grid-cols-2 gap-x-7 gap-y-9 md:mt-0 md:w-2/3 md:grid-cols-4 md:gap-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground">Explore</h3>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">About Us</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Our Chapters</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">What We Do</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Events</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Join Us</Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground">Resources</h3>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Blog</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">FAQ</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Handbook</Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground">Support</h3>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Volunteer</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Donate</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Partners</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Sponsors</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Chat support</Link>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground">Connect</h3>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Discord</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Twitter</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Instagram</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-foreground/70 hover:text-foreground transition-colors">Youtube</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div>
          <hr className="mb-6 border-t border-white/25" />

          <div className="flex flex-col gap-3 text-xs font-normal text-white/65 sm:text-sm md:flex-row md:items-center md:justify-between">
            <p className="leading-5">© 2026 DEVCON Laguna <span className="mx-1 text-white/35">|</span> All Rights Reserved</p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="#" className="underline transition-colors hover:text-white">Terms and Conditions</Link>
              <Link href="#" className="underline transition-colors hover:text-white">Privacy Policy</Link>
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