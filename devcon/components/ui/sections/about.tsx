import AboutDevconSlideshow from '@/components/ui/about-devcon-slideshow';

export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto">
      <div className="w-full bg-background px-4 py-12 mx-auto gap-16 flex flex-col lg:flex-row">
        <div className="max-w-xl">
          <span className="text-base sm:text-xl uppercase tracking-wide text-devcon-lime-500">
            {'// About DevCon Laguna'}
          </span>
          <h2 className="mt-4 text-6xl font-bold tracking-tight text-foreground">
            Who <span className="text-devcon-purple-700">We Are</span>
          </h2>
          <p className="mt-6 text-body-sm sm:text-body-md font-normal leading-relaxed text-foreground">
            DevCon Laguna is a local chapter of the Developers Connect (DevCon)
            community, dedicated to fostering a culture of continuous learning,
            collaboration, and innovation. We bring together students,
            professionals, educators, and technology enthusiasts through
            engaging events, workshops, and community-driven initiatives that
            inspire growth and strengthen the local tech ecosystem.
          </p>
        </div>
        <AboutDevconSlideshow />
      </div>
    </section>
  );
}
