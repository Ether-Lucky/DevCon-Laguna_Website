import InfoCard, { InfoCardProps } from "@/components/ui/sections/mission-vision/info-card";

const companyValues: InfoCardProps[] = [
  {
    id: "mission",
    title: "Mission",
    description:
      "To empower developers and aspiring technology professionals by providing opportunities for learning, collaboration, mentorship, and community engagement while promoting innovation and excellence in the field of technology.",
    themeClass:
      "bg-gradient-to-b from-background to-devcon-purple-700",
    icon: "/mission-vision/bullet.svg",
    iconPosition: "bottom-left",
    iconWidth: 280,
    iconHeight: 243,
    contentAlign: "top",
  },
  {
    id: "vision",
    title: "Vision",
    description:
      "To cultivate a thriving and inclusive technology community in Laguna where individuals are inspired to innovate, lead, and create solutions that positively impact society.",
    themeClass:
      "!justify-center bg-gradient-to-b from-[#f5c518] to-background !justify-end",
    icon: "/mission-vision/eye.svg",
    iconPosition: "top-right",
    iconWidth: 320,
    iconHeight: 240,
    contentAlign: "top",
  },
];

export default function MissionVision() {
  return (
    <section
      id="mission-vision"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-48"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
        {companyValues.map((card) => (
          <InfoCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  );
}
