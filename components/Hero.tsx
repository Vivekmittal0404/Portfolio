"use client";

import { useRef, useEffect } from "react";
import ResumeDoor from "@/components/ResumeDoor";

export default function Hero() {
  const resumeButtonRef = useRef(null);
  const heroRef = useRef<HTMLElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Subtle mouse parallax for the ambient light orbs without React re-renders
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (rafId.current) return;

      rafId.current = requestAnimationFrame(() => {
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 35;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 35;
          heroRef.current.style.setProperty("--aurora-x", `${x}px`);
          heroRef.current.style.setProperty("--aurora-y", `${y}px`);
        }
        rafId.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative flex items-start justify-center overflow-hidden px-6 pt-16 pb-12 md:min-h-screen md:items-center md:pt-0 md:pb-0"
    >
      {/* Dynamic Animated Background Mesh / Auroras */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Tech Dot Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)",
          }}
        />

        {/* Ambient Aurora 1 (Deep Blue / Sky Blue) */}
        <div
          className="animate-aurora-1 will-change-transform absolute top-[15%] left-[25%] h-[380px] w-[500px] rounded-full bg-blue-600/25 blur-[64px] transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(calc(var(--aurora-x, 0px) * 0.7), calc(var(--aurora-y, 0px) * 0.7), 0)`,
          }}
        />

        {/* Ambient Aurora 2 (Electric Violet / Purple) */}
        <div
          className="animate-aurora-2 will-change-transform absolute top-[28%] right-[20%] h-[340px] w-[460px] rounded-full bg-purple-600/20 blur-[64px] transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(calc(var(--aurora-x, 0px) * -0.5), calc(var(--aurora-y, 0px) * -0.5), 0)`,
          }}
        />

        {/* Center Spotlight radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 65% 55% at 50% 42%, rgba(20, 45, 115, 0.45) 0%, rgba(10, 20, 50, 0.25) 45%, rgba(0, 0, 0, 0.95) 85%)`,
          }}
        />
      </div>

      <div className="hero-entrance relative z-10 max-w-4xl text-center">
        {/* Availability badge with rotating cosmic border & radar pulse */}
        <div className="mb-6 inline-flex">
          <div className="rotating-border rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs md:text-sm text-gray-300 backdrop-blur-md shadow-lg shadow-blue-500/5 transition-all duration-300 hover:border-blue-400/40">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-medium tracking-wide">Available for opportunities</span>
            </div>
          </div>
        </div>

        {/* Small greeting */}
        <p className="mt-2 text-sm sm:text-base md:text-lg font-mono tracking-widest uppercase text-blue-400/90">
          Hello, I&apos;m
        </p>

        {/* Main heading with animated text shimmer */}
        <h1 className="mt-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
          <span className="hero-text-shimmer inline-block drop-shadow-md">
            Vivek Mittal
          </span>
        </h1>

        {/* Role with luminous gradient highlight */}
        <div className="mt-5 inline-flex items-center justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
            Full Stack Developer
          </h2>
        </div>

        {/* Description */}
        <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray-400">
          I engineer modern, responsive web applications with a focus on clean
          architecture, intuitive user experiences, and scalable solutions.
        </p>

        {/* Call-to-action buttons */}
        <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="btn-shine group relative px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl hover:shadow-white/10 active:scale-95"
          >
            <span className="flex items-center gap-2">
              View My Work
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>

          <ResumeDoor buttonRef={resumeButtonRef} />

          <a
            href="#contact"
            className="rotating-border group px-8 py-3.5 rounded-full border border-white/20 bg-white/[0.03] text-white font-medium text-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-blue-500/10 active:scale-95"
          >
            Contact Me
          </a>
        </div>

        {/* Social links */}
        <div className="mt-9 sm:mt-11 flex justify-center items-center gap-6 text-sm text-gray-500">
          <a
            href="https://github.com/Vivekmittal0404"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            <span className="text-gray-400 group-hover:text-blue-400 transition-colors">↗</span>
            <span>GitHub</span>
          </a>

          <span className="h-1 w-1 rounded-full bg-white/20" />

          <a
            href="https://www.linkedin.com/in/vivek-mittal-1413a7430/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            <span className="text-gray-400 group-hover:text-blue-400 transition-colors">↗</span>
            <span>LinkedIn</span>
          </a>

          <span className="h-1 w-1 rounded-full bg-white/20" />

          <a
            href="mailto:vivekmittal0404@gmail.com"
            className="group flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            <span className="text-gray-400 group-hover:text-blue-400 transition-colors">✉</span>
            <span>Email</span>
          </a>
        </div>
      </div>
    </section>
  );
}
