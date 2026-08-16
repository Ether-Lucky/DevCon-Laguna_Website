import { RiFacebookFill, RiTwitterFill, RiInstagramFill, RiLinkedinFill, RiYoutubeFill } from "@remixicon/react";

type socialLink = {
  platform: string,
  link: string,
  icon: React.ReactNode,
}

const socialLinks : socialLink[] = [
  { 
    platform: "Facebook", 
    link: "https://www.facebook.com/DEVCONLAGUNA", 
    icon: <RiFacebookFill />, 
  },
  { 
    platform: "Twitter", 
    link: "https://x.com/DEVCONPH", 
    icon: <RiTwitterFill />, 
  },
  { 
    platform: "Instagram", 
    link: "https://www.instagram.com/devconlaguna", 
    icon: <RiInstagramFill />, 
  },
  { 
    platform: "LinkedIn", 
    link: "https://www.linkedin.com/company/devconlaguna/", 
    icon: <RiLinkedinFill />, 
  },
  { 
    platform: "YouTube", 
    link: "https://www.youtube.com/@devconlaguna", 
    icon: <RiYoutubeFill />, 
  },
];

export { socialLinks }