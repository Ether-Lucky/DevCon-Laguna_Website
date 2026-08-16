import { RiFacebookFill, RiTwitterFill, RiInstagramFill, RiLinkedinFill, RiYoutubeFill } from "@remixicon/react";

type socialLink = {
  platform: string,
  link: string,
  icon: React.ReactNode,
}

const iconClassName = "w-5.5 md:w-6 h-auto"

const socialLinks : socialLink[] = [
  { 
    platform: "Facebook", 
    link: "https://www.facebook.com/DEVCONLAGUNA", 
    icon: <RiFacebookFill className={iconClassName} />, 
  },
  { 
    platform: "Twitter", 
    link: "https://x.com/DEVCONPH", 
    icon: <RiTwitterFill className={iconClassName} />, 
  },
  { 
    platform: "Instagram", 
    link: "https://www.instagram.com/devconlaguna", 
    icon: <RiInstagramFill className={iconClassName} />, 
  },
  { 
    platform: "LinkedIn", 
    link: "https://www.linkedin.com/company/devconlaguna/", 
    icon: <RiLinkedinFill className={iconClassName} />, 
  },
  { 
    platform: "YouTube", 
    link: "https://www.youtube.com/@devconlaguna", 
    icon: <RiYoutubeFill className={iconClassName} />, 
  },
];

export { socialLinks }