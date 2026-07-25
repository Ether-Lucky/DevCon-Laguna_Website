export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/" },
  { name: "Events", href: "/" },
  { name: "Officers", href: "/" },
  { name: "Partners", href: "/" },
  { name: "Contact", href: "/" },
] as const;

/** Desktop nav appears above this width; mobile menu below. */
export const navVisibility = {
  desktopOnly: "hidden min-[1050px]:flex",
  mobileOnly: "min-[1050px]:hidden",
} as const;

export const navLinkClassName =
  "text-[18px] font-semibold leading-none text-white/75 transition-colors duration-150 hover:text-white";
