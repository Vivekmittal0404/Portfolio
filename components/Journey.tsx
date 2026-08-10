const journey = [
  {
    year: "2022 — 2026",
    type: "Education",
    title: "B.Tech in Computer Science Engineering",
    subtitle: "Computer Science & Engineering",
    description:
      "Studied computer science fundamentals, software development, artificial intelligence, and modern computing technologies.",
  },
  {
    year: "2026 — Present",
    type: "Development",
    title: "Full Stack Development",
    subtitle: "Continuous Learning",
    description:
      "Refreshing and expanding my full stack development skills while building modern web applications using Next.js, React, TypeScript, and other modern technologies.",
  },
];

export default function Journey() {
  return (
    <section
      id="journey"
      className="px-6 py-5 md:py-0"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section heading */}
        <div className="max-w-3xl">

          <p className="text-sm text-blue-400 tracking-widest uppercase">
            Journey
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            My journey so far
          </h2>

          <p className="mt-5 text-lg text-gray-400 leading-8">
            A brief look at my academic background and development journey.
          </p>

        </div>

        {/* Timeline */}
        <div className="relative mt-14">

          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 md:left-[9px]" />

          <div className="space-y-10">

            {journey.map((item, index) => (
              <div
                key={item.title}
                className="relative pl-10 md:pl-12"
              >

                {/* Timeline dot */}
                <div className="absolute left-0 top-2 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-blue-400/40 bg-black">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                </div>

                {/* Journey card */}
                <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.04]">

                  {/* Year + Type */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <span className="text-sm font-medium text-blue-400">
                      {item.year}
                    </span>

                    <span className="text-xs uppercase tracking-widest text-gray-600">
                      {item.type}
                    </span>

                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-2xl md:text-3xl font-semibold">
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="mt-2 text-gray-400">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="mt-5 max-w-4xl text-gray-500 leading-7">
                    {item.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}