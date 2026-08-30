const projects = [
  {
    number: "01",
    title: "ElectroHub",
    year: "2026",
    description:
      "A full-stack e-commerce web application designed to provide users with a smooth online shopping experience.",
    technologies: [
      "React.js",
      "Node.js",
      "Typescript",
      "MongoDB",
      " React Router",
      "Vite",
      "Vercel",
    ],
    image: "/Project-image/Electrohub.png",
    github:
      "https://github.com/Vivekmittal0404/Electrohub-An-Ecommerce-web-application",
    demo: "https://electrohub-taupe.vercel.app/",
  },
  {
    number: "02",
    title: "Movie Relationship Explorer",
    year: "2026",
    description:
      " a full-stack graph-powered movie exploration platform supporting movie search, detailed movie information, relationship visualization, and related-movie discovery.",
    technologies: [
      "React.js",
      "Node.js",
      "Express",
      "CognoDB",
      "Render",
      "REST APIs",
      "Cypher queries",
    ],
    image: "/Project-image/MovieExplorer.png",

    github: "https://github.com/Vivekmittal0404/Movie-Relationship-Explorer",
    demo: "https://movie-relationship-explorer-frontend.onrender.com/",
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
        <div className="mt-14 space-y-12">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5"
            >
              {/* Project preview */}
              <div className="relative h-64 md:h-80 overflow-hidden border-b border-white/10 bg-[#080808]">
                <img
                  src={project.image}
                  alt={`${project.title} project preview`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/10" />
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
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.demo}
                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-gray-200 "
                  >
                    Live Demo →
                  </a>

                  <a
                    target="_blank"
                    rel="noopener noreferrer"
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
