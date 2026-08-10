export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm text-blue-400 tracking-widest uppercase">
            Contact
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold">
            Let's work together
          </h2>

          <p className="mt-5 text-lg text-gray-400 leading-8">
            Whether you have an opportunity, a project idea, or simply want to
            connect, feel free to reach out.
          </p>
        </div>

        {/* Contact card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.04]">
          <div className="space-y-8">
            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">Email</p>

              <a
                href="mailto:vivekmittal0404@gmail.com"
                className="inline-block text-white transition-all duration-300 hover:translate-x-1 hover:text-blue-400"
              >
                vivekmittal0404@gmail.com
              </a>
            </div>

            {/* LinkedIn */}
            <div>
              <p className="text-sm text-gray-500">LinkedIn</p>

              <span className="inline-flex items-center gap-2 text-white">
                LinkedIn Profile
                <span className="text-xs text-gray-500">Coming soon</span>
              </span>
            </div>

            {/* GitHub */}
            <div>
              <p className="text-sm text-gray-500">GitHub</p>

              <a
                href="https://github.com/Vivekmittal0404"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white transition-all duration-300 hover:translate-x-1 hover:text-blue-400"
              >
                GitHub Profile
              </a>
            </div>
          </div>

          {/* Email button */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <a
              href="mailto:vivekmittal0404@gmail.com"
              className="group inline-flex items-center rounded-full bg-white px-6 py-3 font-medium text-black transition-all duration-300 hover:-translate-y-1 hover:bg-gray-200 hover:shadow-lg hover:shadow-white/10"
            >
              Send me an email
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
