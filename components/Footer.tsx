export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Name */}
          <div className="text-center md:text-left">
            <p className="font-semibold">
              Vivek Mittal
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Full Stack Developer
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">

            <a
              href="#about"
              className="hover:text-white transition-colors"
            >
              About
            </a>

            <a
              href="#skills"
              className="hover:text-white transition-colors"
            >
              Skills
            </a>

            <a
              href="#projects"
              className="hover:text-white transition-colors"
            >
              Projects
            </a>

            <a
              href="#journey"
              className="hover:text-white transition-colors"
            >
              Journey
            </a>

            <a
              href="#contact"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">

          <p className="text-sm text-gray-500">
            © 2026 Vivek Mittal. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}