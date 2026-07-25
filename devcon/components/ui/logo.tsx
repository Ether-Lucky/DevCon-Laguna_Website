import Image from "next/image";

export default function Logo() {
  return (
    <div className="shrink-0 leading-none">
      {/* Shown in dark theme */}
      <Image
        src="/logo/dark-logo.png"
        alt="Devcon Logo"
        width={240}
        height={76}
        priority
        className="hidden h-auto w-[170px] dark:block md:w-[200px]"
      />
      {/* Shown in light theme */}
      <Image
        src="/logo/light-logo.png"
        alt="Devcon Logo"
        width={240}
        height={76}
        priority
        className="block h-auto w-[170px] dark:hidden md:w-[200px]"
      />
      <span className="block text-right text-[24px] font-bold uppercase tracking-[0.01em] text-muted md:text-[24px]">
        Laguna
      </span>
    </div>
  );
}