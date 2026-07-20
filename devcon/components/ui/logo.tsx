import Image from "next/image";

export default function Logo() {
  return (
    <div className="shrink-0 leading-none">
      <Image
        src="/logo/devcon-logoo.png"
        alt="Devcon Logo"
        width={240}
        height={76}
        className="h-auto w-[170px] md:w-[200px]"
        priority
      />
      <span className="block text-right text-[24px] font-bold uppercase tracking-[0.01em] text-[#c7d0da] md:text-[24px]">
        Laguna
      </span>
    </div>
  );
}