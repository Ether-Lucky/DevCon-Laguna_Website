import type { Metadata } from 'next';
import NavBar from '@/components/ui/nav-bar/nav-bar';
import Contact from '@/components/ui/sections/contact';
import Footer from '@/components/ui/sections/footer';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with DevCon Laguna core team. Drop us a line for speaking proposals, sponsorships, volunteering, or general inquiries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | DevCon Laguna',
    description:
      'Get in touch with DevCon Laguna core team. Drop us a line for speaking proposals, sponsorships, volunteering, or general inquiries.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-background text-foreground mt-0 overflow-hidden pt-20">  
        <Contact />
      </main> 
      <Footer />
    </>
  );
}
