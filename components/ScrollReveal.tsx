"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: "left" | "right";
  variant?: "wipe" | "card";
  delay?: number;
  duration?: number;
  easing?: string;
};

export default function ScrollReveal({
  children,
  direction = "left",
  variant = "wipe",
  delay = 0,
  duration,
  easing,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasRevealedRef.current) return;

    // Keep content immediately visible for users who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRevealedRef.current) return;

        hasRevealedRef.current = true;
        observer.unobserve(element);

        // A subtle fade/slide avoids expensive clip-path wipes and feels responsive.
        const xOffset =
          variant === "card" ? 0 : direction === "left" ? -10 : 10;
        const yOffset = variant === "card" ? 14 : 8;

        element.animate(
          [
            {
              opacity: 0,
              transform: `translate3d(${xOffset}px, ${yOffset}px, 0)`,
            },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ],
          {
            duration: duration ?? (variant === "card" ? 420 : 460),
            delay: Math.max(0, delay),
            easing: easing ?? "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          },
        );
      },
      { threshold: 0, rootMargin: "0px 0px -2% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, direction, duration, easing, variant]);

  return <div ref={elementRef}>{children}</div>;
}
