import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex-col shrink-0 size-fit leading-none">
      {/* Shown in dark theme */}
      <Image
        src="/logo/dark-logo.png"
        alt="Devcon Logo"
        width={240}
        height={76}
        priority
        className="hidden dark:block h-auto w-[170px] md:w-[200px]"
      />
      {/* Shown in light theme */}
      <Image
        src="/logo/light-logo.png"
        alt="Devcon Logo"
        width={240}
        height={76}
        priority
        className="block dark:hidden h-auto w-[170px] md:w-[200px]"
      />
      <span className="block text-right text-lg md:text-lg font-bold font-sans uppercase tracking-[0.01em] text-muted">
        Laguna
      </span>
    </div>
  );
}