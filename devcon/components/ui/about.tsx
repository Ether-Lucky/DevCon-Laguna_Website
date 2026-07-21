import Slideshow from '@/components/ui/slideshow';

export default function About() {
  return (
    <section
      id="about"
      className="w-full bg-devcon-black px-4 py-16 font-inter sm:px-6 sm:py-20 md:px-8"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="max-w-xl">
          <span className="text-xl font-medium uppercase tracking-wide text-devcon-gray sm:text-2xl">
            About DevCon Laguna
          </span>

          <h2 className="mt-4 text-display-sm font-extrabold tracking-tight text-devcon-white sm:text-display-md">
            Who <span className="text-devcon-purple-bright">We Are</span>
          </h2>

          <p className="mt-6 text-body-md font-normal leading-relaxed text-devcon-white">
            DevCon Laguna is a local chapter of the Developers Connect (DevCon)
            community, dedicated to fostering a culture of continuous learning,
            collaboration, and innovation. We bring together students,
            professionals, educators, and technology enthusiasts through
            engaging events, workshops, and community-driven initiatives that
            inspire growth and strengthen the local tech ecosystem.
          </p>
        </div>

        <Slideshow />
      </div>
    </section>
  );
}
