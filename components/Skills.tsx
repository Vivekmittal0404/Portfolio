const skillCategories = [
  {
    title: "Frontend",
    description: "Building responsive and modern user interfaces.",
    skills: [
      { name: "HTML", short: "H" },
      { name: "CSS", short: "C" },
      { name: "JavaScript", short: "JS" },
      { name: "React", short: "R" },
      { name: "Next.js", short: "N" },
      { name: "TypeScript", short: "TS" },
      { name: "Tailwind CSS", short: "TW" },
    ],
  },

  {
    title: "Backend",
    description: "Building APIs, server-side logic and applications.",
    skills: [
      { name: "Node.js", short: "N" },
      { name: "Express", short: "EX" },
      { name: "FastAPI", short: "FA" },
      { name: "REST APIs", short: "API" },
    ],
  },

  {
    title: "Database & Tools",
    description: "Working with data, version control and development tools.",
    skills: [
      { name: "MongoDB", short: "M" },
      { name: "Git", short: "G" },
      { name: "GitHub", short: "GH" },
    ],
  },

  {
    title: "AI / Data",
    description: "Exploring data analysis and Python-based technologies.",
    skills: [
      { name: "Python", short: "PY" },
      { name: "NumPy", short: "NP" },
      { name: "Matplotlib", short: "MP" },
    ],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="px-6 py-4"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section heading */}
        <div className="max-w-3xl">

          <p className="text-sm text-blue-400 tracking-widest uppercase">
            Skills
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Technologies I work with
          </h2>

          <p className="mt-5 text-lg text-gray-400 leading-8">
            Technologies I've worked with and continue to explore
            as I grow and improve as a developer.
          </p>

        </div>

        {/* Skill categories */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">

          {skillCategories.map((category) => (
            <div
              key={category.title}
className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-blue-500/5"            >

              {/* Category title */}
              <h3 className="text-xl font-semibold">
                {category.title}
              </h3>

              {/* Category description */}
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {category.description}
              </p>

              {/* Technologies */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">

                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
className="group/skill flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/5 hover:shadow-lg hover:shadow-blue-500/5"                  >

                    {/* Technology symbol */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-semibold text-blue-400 transition-colors duration-300 group-hover/skill:border-blue-400/30 group-hover/skill:text-blue-300">
                      {skill.short}
                    </div>

                    {/* Technology name */}
                    <span className="text-sm text-gray-300 group-hover/skill:text-white transition-colors duration-300">
                      {skill.name}
                    </span>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}   