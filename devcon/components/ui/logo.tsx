import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-col leading-none w-max">
      <Image
        src="/logo/devcon-Logo.png"
        alt="Devcon Logo"
        width={240}
        height={76}
        className="h-auto w-[170px] md:w-[200px] object-contain"
        priority
      />
      <span className="block text-right text-[20px] font-bold uppercase tracking-[0.15em] text-[#c7d0da] mt-0.5">
        Laguna
      </span>
    </div>
  );
}