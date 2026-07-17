import NavLinks from "@/components/ui/nav-bar/nav-links";
import Button from "@/components/ui/button";
import ThemeButton from "@/components/ui/nav-bar/theme-button";

export default function NavBar() {
  return (
    <nav className='flex flex-row gap-16 align-middle'>
      {/* Logo */}
      <NavLinks />
      <Button label="Join Us" variant="primary" hasArrow={false} />
      <ThemeButton theme="light" />
    </nav>
  );
}