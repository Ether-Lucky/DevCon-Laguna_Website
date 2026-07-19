import NavLinks from "@/components/ui/nav-bar/nav-links";
import Button from "@/components/ui/button";
import ThemeButton from "@/components/ui/nav-bar/theme-button";
import Logo from "@/components/ui/logo";

export default function NavBar() {
  return (
    <header>
      <nav className="mx-auto flex min-h-[86px] w-full max-w-[1200px] items-center px-6 py-2 md:px-8">
        <Logo />

        <div className="mx-auto hidden md:block">
          <NavLinks />
        </div>

        <div className="ml-auto flex items-center gap-3 md:gap-4">
          <Button
            label="Join Us"
            variant="primary"
            hasArrow={false}
            className="h-12 px-8 text-body-sm font-semibold leading-none"
          />
          <ThemeButton theme="dark" />
        </div>
      </nav>
    </header>
  );
}