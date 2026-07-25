import Link from 'next/link';
import Logo from '../logo';
import SocialMedia from './social-media';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-gradient-to-b from-transparent via-[#6A0DF2]/50 to-[#6A0DF2] text-white pt-16 pb-8 px-6 md:px-12 font-sans mt-24">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16">
        
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          
          <div className="md:w-1/3">
            
            {/* DevCon Laguna Logo Component */}
            <div className="mb-6">
              <Logo />
            </div>

            <p className="text-[18px] text-body-md font-extralight leading-[30px] tracking-normal text-devcon-white mb-2 max-w-sm"> Empowering the next generation of developers through innovation, collaboration, and community.</p>

            {/* Integrated Social Media Component */}
            <SocialMedia />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:w-2/3 mt-8 md:mt-0">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg mb-2">Explore</h3>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">About Us</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Our Chapters</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">What We Do</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Events</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Join Us</Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg mb-2">Resources</h3>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Blog</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">FAQ</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Handbook</Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg mb-2">Support</h3>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Volunteer</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Donate</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Partners</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Sponsors</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Chat support</Link>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg mb-2">Connect</h3>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Discord</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Instagram</Link>
              <Link href="#" className="text-[18px] text-body-md font-extralight leading-[30px] tracking-[0%] text-gray-200 hover:text-white transition-colors">Youtube</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div>
          <hr className="border-t border-gray-400/50 mb-6" />

          <div className="text-center text-[18px] font-normal leading-[18px] tracking-[0px] text-gray-300">
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