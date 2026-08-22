import Link from 'next/link';
import Logo from '../logo';
import SocialMedia from './social-media';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-gradient-to-b from-transparent via-devcon-purple-500/50 to-devcon-purple-500 text-white pt-16 md:pt-24 pb-8 px-4 md:px-8 mt-16 md:mt-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          
          <div className="md:w-1/3">
            
            {/* DevCon Laguna Logo Component */}
            <div className="mb-6">
              <Logo />
            </div>

            <p className="text-sm sm:text-base font-light text-white/90 mb-6 max-w-sm"> Empowering the next generation of developers through innovation, collaboration, and community.</p>

            {/* Integrated Social Media Component */}
            <SocialMedia />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:w-2/3 mt-8 md:mt-0">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg mb-2">Explore</h3>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">About Us</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Our Chapters</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">What We Do</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Events</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Join Us</Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg mb-2">Resources</h3>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Blog</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">FAQ</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Handbook</Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg mb-2">Support</h3>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Volunteer</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Donate</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Partners</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Sponsors</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Chat support</Link>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg mb-2">Connect</h3>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Discord</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Instagram</Link>
              <Link href="#" className="text-sm sm:text-base font-light text-white/70 hover:text-white transition-colors">Youtube</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div>
          <hr className="border-t border-white/20 mb-6" />

          <div className="text-center text-xs sm:text-sm font-normal text-white/60">
            <p>
              © 2026 DEVCON Laguna | All Rights Reserved |{' '}
              <Link href="#" className="underline hover:text-white transition-colors">Terms and Conditions</Link> |{' '}
              <Link href="#" className="underline hover:text-white transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}