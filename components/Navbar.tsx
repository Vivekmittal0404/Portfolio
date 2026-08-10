"use client";

import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a
          href="#"
          className="text-xl font-bold text-white"
          onClick={closeMenu}
        >
          Vivek
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          <a
            href="#about"
            className="relative text-gray-300 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </a>

          <a
            href="#skills"
            className="relative text-gray-300 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Skills
          </a>

          <a
            href="#projects"
            className="relative text-gray-300 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Projects
          </a>

          <a
            href="#journey"
            className="relative text-gray-300 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Journey
          </a>

          <a
            href="#contact"
            className="relative text-gray-300 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-300 transition-all duration-300 hover:border-white/20 hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <span className="text-2xl leading-none">×</span>
          ) : (
            <span className="text-xl leading-none">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`border-t border-white/10 bg-black/95 md:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col px-6 py-4">
          <a
            href="#about"
            onClick={closeMenu}
            className="border-b border-white/5 py-4 text-gray-300 transition-colors duration-300 hover:text-white"
          >
            About
          </a>

          <a
            href="#skills"
            onClick={closeMenu}
            className="border-b border-white/5 py-4 text-gray-300 transition-colors duration-300 hover:text-white"
          >
            Skills
          </a>

          <a
            href="#projects"
            onClick={closeMenu}
            className="border-b border-white/5 py-4 text-gray-300 transition-colors duration-300 hover:text-white"
          >
            Projects
          </a>

          <a
            href="#journey"
            onClick={closeMenu}
            className="border-b border-white/5 py-4 text-gray-300 transition-colors duration-300 hover:text-white"
          >
            Journey
          </a>

          <a
            href="#contact"
            onClick={closeMenu}
            className="py-4 text-gray-300 transition-colors duration-300 hover:text-white"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
