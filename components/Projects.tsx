const projects = [
  {
    number: "01",
    title: "ElectroHub",
    year: "2026",
    description:
      "A full-stack e-commerce web application designed to provide users with a smooth online shopping experience.",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    github: "#",
    demo: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-15 md:py-28">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="max-w-3xl">
          <p className="text-sm text-blue-400 tracking-widest uppercase">
            Projects
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Things I've built
          </h2>

          <p className="mt-5 text-lg text-gray-400 leading-8">
            A selection of projects where I've applied my development skills to
            build practical applications.
          </p>
        </div>

        {/* Projects */}
        <div className="mt-14">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5"
            >
              {/* Project preview */}
              <div className="relative h-64 md:h-80 overflow-hidden border-b border-white/10 bg-[#080808]">
                {/* Browser header */}
                <div className="absolute inset-x-0 top-0 h-10 border-b border-white/10 bg-white/[0.03] flex items-center px-4">
                  <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                  </div>

                  <div className="mx-auto hidden sm:block rounded-md border border-white/10 bg-black/30 px-16 py-1 text-xs text-gray-600">
                    electrohub.app
                  </div>
                </div>

                {/* Preview content */}
                <div className="absolute inset-0 flex items-center justify-center pt-10">
                  <div className="text-center transition-transform duration-500 group-hover:scale-105">
                    <div className="text-5xl md:text-6xl font-bold tracking-tight text-white/10">
                      ELECTROHUB
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                      Full Stack E-Commerce Platform
                    </p>
                  </div>
                </div>

                {/* Subtle glow */}
                <div className="absolute left-1/2 top-1/2 -z-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
              </div>

              {/* Project information */}
              <div className="p-7 md:p-9">
                {/* Number + year */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-400">
                    {project.number}
                  </span>

                  <span className="text-sm text-gray-600">{project.year}</span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-3xl font-semibold">{project.title}</h3>

                {/* Description */}
                <p className="mt-4 max-w-3xl text-gray-400 leading-7">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-gray-400 transition-colors duration-300 hover:border-blue-400/30 hover:text-white"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={project.demo}
                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-gray-200"
                  >
                    Live Demo →
                  </a>

                  <a
                    href={project.github}
                    className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.05]"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
