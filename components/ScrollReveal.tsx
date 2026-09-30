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

    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealedRef.current) {
          hasRevealedRef.current = true;
          observer.unobserve(element);
          const keyframes =
            variant === "card"
              ? [
                  { opacity: 0, transform: "translateY(20px) scale(0.97)" },
                  { opacity: 1, transform: "translateY(0) scale(1)" },
                ]
              : direction === "left"
                ? [
                    { clipPath: "inset(0 100% 0 0)" },
                    { clipPath: "inset(0 0 0 0)" },
                  ]
                : [
                    { clipPath: "inset(0 0 0 100%)" },
                    { clipPath: "inset(0 0 0 0)" },
                  ];

          element.animate(keyframes, {
            duration: duration ?? (variant === "card" ? 1000 : 1400),
            delay,
            easing:
              easing ??
              (variant === "card"
                ? "cubic-bezier(0.22, 1, 0.36, 1)"
                : "cubic-bezier(0.65, 0, 0.35, 1)"),
          });
        }
      },
      { threshold: 0, rootMargin: "0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, direction, duration, easing, variant]);

  return <div ref={elementRef}>{children}</div>;
}
