"use client";

import { useRef } from "react";
import ResumeDoor from "@/components/ResumeDoor";

export default function Hero() {
  const resumeButtonRef = useRef(null);
  return (
    <section
      id="home"
      className="relative flex items-start justify-center overflow-hidden px-6 pt-12 pb-0 md:min-h-screen md:items-center md:pt-0 md:pb-0"
    >
       {/* Background gradient */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: `
         radial-gradient(
      ellipse 75% 65% at 50% 38%,
      rgba(30, 55, 145, 0.55) 0%,
      rgba(20, 38, 100, 0.38) 32%,
      rgba(8, 15, 40, 0.18) 55%,
      rgba(0, 0, 0, 0) 82%
    ),
        #000000
      `,
    }}
  />

      <div className="relative z-10 max-w-4xl text-center">
        {/* Availability badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          Available for opportunities
        </div>

        {/* Small introduction */}
        <p className="mt-3 sm:mt-6 max-w-2xl mx-auto px-4 text-sm sm:text-base md:text-lg leading-7 md:leading-8 text-gray-400">
          Hello, I'm
        </p>
        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          Vivek Mittal
        </h1>

        {/* Role */}
        <h2 className="mt-6 text-2xl md:text-3xl font-medium text-gray-300">
          Full Stack Developer
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg leading-8 text-gray-400">
          I build modern, responsive web applications with a focus on clean
          design, great user experiences, and scalable solutions.
        </p>

        {/* Buttons */}

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="px-7 py-3 rounded-full bg-white text-black font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow-lg hover:shadow-white/7"
          >
            View My Work
          </a>
          <ResumeDoor buttonRef={resumeButtonRef} />

          {/* <a
            href="/resume.pdf"
            target="_blank"
            className="px-7 py-3 rounded-full border border-white/20 text-white font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
          >
            View Resume
          </a> */}

          <a
            href="#contact"
            className="px-7 py-3 rounded-full border border-white/20 text-white font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
          >
            Contact Me
          </a>
        </div>

        {/* Social links */}
        <div className="mt-8 sm:mt-10 flex justify-center gap-6 text-sm text-gray-500">
          {" "}
          <a
            href="https://github.com/Vivekmittal0404"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/vivek-mittal-1413a7430/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:text-white"
          >
            Linkedin
          </a>
          <a
            href="mailto:vivekmittal0404@gmail.com"
            className="inline-block text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:text-white"
          >
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
