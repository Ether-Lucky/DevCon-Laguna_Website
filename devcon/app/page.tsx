import Image from "next/image";
import NavLinks from "@/components/ui/nav-links";

export default function Home() {
  return (
    <>
      <nav className='flex flex-row gap-16'>
        {/* Logo */}
        <NavLinks />
        <button>Join Us</button>
        {/* Theme Button */}
      </nav>
      <main></main>
      <footer></footer>
    </>
  );
}
