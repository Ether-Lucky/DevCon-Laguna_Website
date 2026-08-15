interface ProgramOrActivity {
  id: number;
  title: string;
  description?: string;
  bannerImg?: string; 
  primaryBtnLabel: string;
  primaryBtnLink: string;
  secondaryBtnLabel?: string;
  secondaryBtnLink?: string;
}

const programsAndActivities: ProgramOrActivity[] = [
  {
    id: 1,
    title: "Become Part of the DevCon Kids Community",
    description: "Join us in shaping a future where every kid can code, create, and change the world.",
    bannerImg: "/images/banner/banner1.png",
    primaryBtnLabel: "Join Us",
    primaryBtnLink: "",
    secondaryBtnLabel: "Learn More",
    secondaryBtnLink: ""
  },
  {
    id: 2,
    title: "Empowering Next-Gen Developers Daily",
    description: "Explore our intensive workshops, hackathons, and tech talks tailored for growth.",
    bannerImg: "", 
    primaryBtnLabel: "Explore",
    primaryBtnLink: "",
    secondaryBtnLabel: "View Events",
    secondaryBtnLink: ""
  },
  {
    id: 3,
    title: "Innovate Together with DevCon Laguna Initiatives",
    description: "Collaborate with passionate student developers and industry leaders across the region.",
    bannerImg: "", 
    primaryBtnLabel: "Get Involved",
    primaryBtnLink: "",
    secondaryBtnLabel: "Contact Us",
    secondaryBtnLink: ""
  },
];

export type { ProgramOrActivity }
export { programsAndActivities }