const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Officers", href: "#officers" },
  { name: "Partners", href: "#partners" },
  { name: "Contact", href: "#contact" },
];

const navVisibility = {
  desktopOnly: "hidden min-[1050px]:flex",
  mobileOnly: "min-[1050px]:hidden",
}

export { navLinks, navVisibility }