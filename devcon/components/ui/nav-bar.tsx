import NavLinks from "@/components/ui/nav-links";

export default function NavBar() {
  return (
    <nav className='flex flex-row gap-16'>
      {/* Logo */}
      <NavLinks />
      <button>Join Us</button>
      {/* Theme Button */}
    </nav>
  );
}