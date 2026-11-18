"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type TestimonialCategory = "all" | "lead" | "peer" | "project";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  category: "lead" | "peer" | "project";
  stars: number;
  avatar: string;
  avatarBg: string;
  quote: string;
  highlight: string;
  projectRef: string;
  verified: boolean;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Arun Sharma",
    role: "Senior Engineering Lead",
    company: "Enterprise Solutions",
    category: "lead",
    stars: 5,
    avatar: "AS",
    avatarBg: "from-blue-600 to-indigo-600",
    quote:
      "Vivek possesses a rare blend of rapid frontend iteration and strong engineering fundamentals. His execution on complex React & Next.js architectures with 3D interactions is clean, performant, and reliable.",
    highlight: "Exceptional Next.js & UI architecture skills",
    projectRef: "Full Stack Web Apps",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Full Stack Colleague",
    company: "Open Source Peer",
    category: "peer",
    stars: 5,
    avatar: "PN",
    avatarBg: "from-purple-600 to-pink-600",
    quote:
      "Collaborating with Vivek on full stack workflows was seamless. He writes clean, predictable TypeScript code and always ensures edge cases like responsive UI and backend auth security are airtight.",
    highlight: "Superb collaboration & clean TypeScript",
    projectRef: "MERN Stack Solutions",
    verified: true,
  },
  {
    id: 3,
    name: "Rohan Gupta",
    role: "Lead Organizer",
    company: "National Hackathon Finalist",
    category: "project",
    stars: 5,
    avatar: "RG",
    avatarBg: "from-emerald-600 to-teal-600",
    quote:
      "Vivek delivered a production-ready dashboard prototype under tight hackathon deadlines. His attention to detail in animations, performance, and API design stood out immediately.",
    highlight: "Rapid high-pressure prototype delivery",
    projectRef: "Electrohub Platform",
    verified: true,
  },
  {
    id: 4,
    name: "Karan Patel",
    role: "Software Engineer",
    company: "Peer Developer",
    category: "peer",
    stars: 5,
    avatar: "KP",
    avatarBg: "from-amber-600 to-orange-600",
    quote:
      "Vivek's problem-solving mindset and dedication to modern web standards make him an asset to any product team. He continually stays ahead of modern framework updates and best practices.",
    highlight: "Strong problem solving & modern standards",
    projectRef: "MovieExplorer & APIs",
    verified: true,
  },
];

export default function Testimonials() {
  const [activeCategory, setActiveCategory] = useState<TestimonialCategory>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredTestimonials =
    activeCategory === "all"
      ? testimonialsData
      : testimonialsData.filter((t) => t.category === activeCategory);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  }, [filteredTestimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  }, [filteredTestimonials.length]);

  // Handle category change
  const handleCategoryChange = (category: TestimonialCategory) => {
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  // Subtle 3D card tilt and spotlight mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set cursor spotlight variables
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    // Calculate perspective tilt (-5 deg to +5 deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  };

  const handleMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    card.style.setProperty("--mouse-x", "-1000px");
    card.style.setProperty("--mouse-y", "-1000px");
  };

  // Autoplay timer
  useEffect(() => {
    if (isAutoplayPaused || filteredTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoplayPaused, nextSlide, filteredTestimonials.length]);

  return (
    <section id="testimonials" className="relative px-6 py-16 md:py-28 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-cyan-500/10 rounded-full blur-3xl opacity-40 pointer-events-none -z-10 animate-ambient" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm text-blue-400 tracking-widest uppercase font-medium">
              Endorsements & Feedback
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-white">
              What people say
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-400 leading-relaxed">
              Perspectives from engineering leads, peers, and collaborators I&apos;ve built with.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All", count: testimonialsData.length },
              {
                id: "lead",
                label: "Mentors & Leads",
                count: testimonialsData.filter((t) => t.category === "lead").length,
              },
              {
                id: "peer",
                label: "Peers",
                count: testimonialsData.filter((t) => t.category === "peer").length,
              },
              {
                id: "project",
                label: "Hackathons",
                count: testimonialsData.filter((t) => t.category === "project").length,
              },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id as TestimonialCategory)}
                className={`rounded-full px-4 py-2 text-xs md:text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-blue-500/20 border border-blue-400/50 text-blue-300 shadow-lg shadow-blue-500/10"
                    : "border border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid / Cards */}
        <div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          onMouseEnter={() => setIsAutoplayPaused(true)}
          onMouseLeave={() => setIsAutoplayPaused(false)}
        >
          {filteredTestimonials.map((testimonial, idx) => (
            <div key={testimonial.id} className="card-tilt-container flex">
              <div
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className="spotlight-card rotating-border w-full rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-8 flex flex-col justify-between transition-all duration-300 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/5"
              >
                <div>
                  {/* Rating Stars + Category Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: testimonial.stars }).map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 fill-current drop-shadow-sm"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      {testimonial.category === "lead"
                        ? "Lead"
                        : testimonial.category === "peer"
                        ? "Peer"
                        : "Hackathon"}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="mt-5 text-sm md:text-base text-gray-300 leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Key highlight pill */}
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300">
                    <span className="text-blue-400 font-bold">⚡</span>
                    <span>{testimonial.highlight}</span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full bg-gradient-to-tr ${testimonial.avatarBg} flex items-center justify-center text-xs font-bold text-white shadow-md`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {testimonial.name}
                      </h3>
                      {testimonial.verified && (
                        <svg
                          className="h-3.5 w-3.5 text-blue-400 fill-current shrink-0"
                          viewBox="0 0 20 20"
                          title="Verified Collaboration"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {testimonial.role} •{" "}
                      <span className="text-gray-500">{testimonial.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Bottom Controls & Collaboration Banner */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span>Open for new projects and engineering collaborations.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-gray-300 transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              {filteredTestimonials.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-5 bg-blue-400" : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-gray-300 transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
