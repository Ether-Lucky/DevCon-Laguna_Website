import NavBar from '@/components/ui/nav-bar/nav-bar';
import Contact from '@/components/ui/sections/contact';
import Footer from '@/components/ui/sections/footer';

export default function ContactPage() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-background text-foreground mt-0 overflow-hidden pt-20">  
        <Contact />
      </main> 
      <Footer/>
    </>
  );
}
