import Button from "@/components/ui/button";
import ThemeButton from "./theme-button";

export default function NavActions() {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <Button label="Join Us" variant="primary" hasArrow={false} />
      <ThemeButton theme="dark" />
    </div>
  );
}
