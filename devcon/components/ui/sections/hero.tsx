import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="flex flex-row w-full">
      <div className="w-1/2">
        <h1>Building the Future of Tech, Together.</h1>
        <p>DevCon Laguna is a community of developers, students, and technology enthusiasts dedicated to learning, collaborating, and creating meaningful impact through technology.</p>
        {/* Social Media Links */}
        <div className="flex flex-row gap-16">
          <button>Volunteer</button>
          <button>Learn More</button>
        </div>
      </div>
      <div className="relative w-1/2 flex">
        <Image
          src="/hero/blob.png"
          alt="Developer Conference"
          width={672}
          height={886}
          className="absolute z-1"
        />
        <Image
          src="/hero/purple-dots.png"
          alt=""
          width={1105}
          height={1105}
          className="opacity-50 absolute z-0"
        />
      </div>
    </section>
  );
}
