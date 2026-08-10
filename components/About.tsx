export default function About() {
  return (
    <section id="about" className="px-6 py-24 pb-13 md:pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="max-w-3xl">
          <p className="text-sm text-blue-400 tracking-widest uppercase">
            About Me
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            A developer who enjoys
            <br className="hidden md:block" />
            building things that work.
          </h2>
        </div>

        {/* Main content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Description */}
          <div className="space-y-6 text-gray-400 leading-8 text-lg">
            <p>
              I'm a Computer Science Engineering graduate with an interest in
              full stack development and modern web technologies.
            </p>

            <p>
              I enjoy turning ideas into practical applications, solving
              problems through code, and continuously learning technologies that
              help me build better software.
            </p>

            <p>
              My development journey includes JavaScript, React, Node.js,
              MongoDB, Python and other technologies used to build modern web
              applications.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-white/2">
              <div className="text-blue-400 text-sm font-medium">Frontend</div>

              <h3 className="mt-3 text-xl font-semibold">Modern Interfaces</h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Building responsive and user-friendly interfaces with React and
                Next.js.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-white/2">
              <div className="text-blue-400 text-sm font-medium">Backend</div>

              <h3 className="mt-3 text-xl font-semibold">
                Full Stack Thinking
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Working with APIs, servers, databases and application logic.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-white/2">
              <div className="text-blue-400 text-sm font-medium">
                Problem Solving
              </div>

              <h3 className="mt-3 text-xl font-semibold">Build & Improve</h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Breaking problems into smaller pieces and improving solutions
                step by step.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-white/2">
              <div className="text-blue-400 text-sm font-medium">Learning</div>

              <h3 className="mt-3 text-xl font-semibold">Always Exploring</h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Exploring modern tools and technologies to keep improving as a
                developer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
