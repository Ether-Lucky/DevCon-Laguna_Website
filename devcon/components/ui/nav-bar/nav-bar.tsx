import Logo from "@/components/ui/logo";
import NavLinks from "./nav-links";
import NavActions from "./nav-actions";
import MobileNav from "./mobile-nav";

export default function NavBar() {
  return (
    <header className="relative sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md p-4">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2 md:px-12 lg:px-8">
        <Logo />
        <NavLinks />
        <div className="hidden xl:flex">
          <NavActions />
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
