import Logo from "@/components/ui/logo";
import NavLinks from "./nav-links";
import NavActions from "./nav-actions";
import MobileNav from "./mobile-nav";
import { navVisibility } from "./constants";

export default function NavBar() {
  return (
    <header className="relative sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex min-h-[86px] w-full max-w-[1200px] items-center justify-between px-6 py-2 md:px-12 lg:px-8">
        <Logo />

        <NavLinks className={navVisibility.desktopOnly} />

        <div className={navVisibility.desktopOnly}>
          <NavActions />
        </div>

        <MobileNav />
      </nav>
    </header>
  );
}
