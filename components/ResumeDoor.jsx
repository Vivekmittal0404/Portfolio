"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ResumeDoor({ buttonRef }) {
  const [stage, setStage] = useState("closed");
  const [origin, setOrigin] = useState(null);

  function openResume() {
    if (!buttonRef?.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setOrigin({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });

    setStage("expanding");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStage("opening");
      });
    });

    setTimeout(() => {
      setStage("revealed");
      document.body.style.overflow = "hidden";
    }, 1100);
  }

  function closeResume() {
    setStage("closing");

    setTimeout(() => {
      setStage("shrinking");

      setTimeout(() => {
        setStage("closed");
        document.body.style.overflow = "";
      }, 1000);
    }, 750);
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={openResume}
        className="px-7 py-3 rounded-full border border-white/20 text-white font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
      >
        View Resume
      </button>

      {stage !== "closed" &&
        origin &&
        createPortal(
          <div
            className={`resume-door-overlay resume-stage-${stage}`}
            style={{
              "--origin-left": `${origin.left}px`,
              "--origin-top": `${origin.top}px`,
              "--origin-width": `${origin.width}px`,
              "--origin-height": `${origin.height}px`,
            }}
          >
            <div className="resume-page-backdrop" />

            {/* Resume PDF */}
            <div className="resume-document">
              <iframe src="/resume.pdf" title="Vivek Mittal Resume" />
            </div>

            {/* Close button */}
            <button
              type="button"
              className="resume-close"
              onClick={closeResume}
              aria-label="Close resume"
            >
              ×
            </button>

            {/* Left door */}
            <div className="resume-door resume-door-left">
              <div className="door-panel">
                <div className="door-inner-border" />
                <div className="door-handle" />
              </div>
            </div>

            {/* Right door */}
            <div className="resume-door resume-door-right">
              <div className="door-panel">
                <div className="door-inner-border" />
                <div className="door-handle" />
              </div>
            </div>

            <div className="door-light" />
          </div>,
          document.body,
        )}
    </>
  );
}
