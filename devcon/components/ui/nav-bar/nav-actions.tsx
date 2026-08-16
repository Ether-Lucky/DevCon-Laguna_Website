import Button from "@/components/ui/button";
import ThemeButton from "./theme-button";

export default function NavActions() {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <Button label="Join Us" icon={null} variant="primary" />
      <ThemeButton />
    </div>
  );
}
