"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useCallback, useRef } from "react";

function isMobileOrNoPdfSupport() {
  if (typeof window === "undefined") return false;

  // 1. Android Chrome, Samsung Internet, and mobile browsers explicitly report pdfViewerEnabled === false
  if (typeof navigator !== "undefined" && navigator.pdfViewerEnabled === false) {
    return true;
  }

  // 2. Comprehensive Mobile / Tablet / Phone User Agent test
  const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      ua
    )
  ) {
    return true;
  }

  // 3. Modern Chromium Client Hints (Android even if "Desktop site" is requested)
  const uaData =
    typeof navigator !== "undefined" ? navigator.userAgentData : undefined;
  if (uaData?.mobile || /Android/i.test(uaData?.platform || "")) {
    return true;
  }

  // 4. Touchscreen detection (all physical mobile devices have touch)
  const isTouch =
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) ||
    "ontouchstart" in window ||
    (typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches);

  // 5. If it's a touch device AND screen width <= 1024px (covers all phones, foldables, tablets in portrait & landscape)
  if (isTouch && window.innerWidth <= 1024) {
    return true;
  }

  // 6. Direct viewport width check for DevTools or narrow windows
  if (window.innerWidth < 800) {
    return true;
  }

  // 7. Pure touch devices without mouse hover capability
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: none)").matches
  ) {
    return true;
  }

  return false;
}

export default function ResumeDoor({ buttonRef }) {
  // stages: "closed" -> "expanding" -> "expanded" -> "opened" -> "closing" -> "shrinking" -> "closed"
  const [stage, setStage] = useState("closed");
  const [origin, setOrigin] = useState({ x: 0, y: 0, scaleX: 0.15, scaleY: 0.05 });
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf?v=20261119");
  const [isMobile, setIsMobile] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const touchStartDistRef = useRef(0);
  const initialZoomRef = useRef(1);
  const lastTapRef = useRef(0);
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    const update = () => setIsMobile(isMobileOrNoPdfSupport());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(2.5, Math.round((prev + 0.25) * 100) / 100));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(1.0, Math.round((prev - 0.25) * 100) / 100));
  };

  const handleZoomReset = () => {
    setZoomScale(1.0);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      initialZoomRef.current = zoomScale;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double tap toggles between 1.0x and 1.5x
        setZoomScale((prev) => (prev > 1.1 ? 1.0 : 1.5));
      }
      lastTapRef.current = now;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchStartDistRef.current > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartDistRef.current;
      const newScale = Math.min(2.5, Math.max(1.0, initialZoomRef.current * ratio));
      setZoomScale(Math.round(newScale * 100) / 100);
    }
  };

  const handleTouchEnd = () => {
    touchStartDistRef.current = 0;
  };

  const calculateOrigin = useCallback(() => {
    if (buttonRef?.current && typeof window !== "undefined") {
      const rect = buttonRef.current.getBoundingClientRect();
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;
      return {
        x: bx - cx,
        y: by - cy,
        scaleX: Math.max(0.04, rect.width / window.innerWidth),
        scaleY: Math.max(0.02, rect.height / window.innerHeight),
      };
    }
    return { x: 0, y: 0, scaleX: 0.15, scaleY: 0.05 };
  }, [buttonRef]);

  const openResume = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (openTimerRef.current) clearTimeout(openTimerRef.current);

    // Re-evaluate device/browser support freshly at the exact moment of click
    setIsMobile(isMobileOrNoPdfSupport());
    setZoomScale(1.0);

    const anonymousId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("portfolio_anonymous_visitor")
        : null;
    
    // Asynchronously record download/view metric without delaying render
    if (typeof window !== "undefined") {
      const trackUrl = anonymousId
        ? `/api/resume/download?visitor=${encodeURIComponent(anonymousId)}`
        : "/api/resume/download";
      void fetch(trackUrl, { method: "GET", keepalive: true }).catch(() => undefined);
    }
    setResumeUrl(`/resume.pdf?v=20261119`);

    // Calculate exact button position to emerge from
    const coords = calculateOrigin();
    setOrigin(coords);

    document.body.style.overflow = "hidden";
    // Stage 1: Mount collapsed at the exact button coordinates
    setStage("expanding");

    // Stage 2: Expand smoothly from button to full screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStage((prev) => (prev === "expanding" ? "expanded" : prev));
      });
    });

    // Stage 3: Once fully expanded, smoothly swing the 3D vault doors open
    openTimerRef.current = setTimeout(() => {
      setStage("opened");
    }, 520);
  }, [calculateOrigin]);

  const closeResume = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setZoomScale(1.0);

    // Refresh button coordinates in case of any viewport adjustments
    const coords = calculateOrigin();
    setOrigin(coords);

    // Step 1: Smoothly swing the 3D doors shut to the center
    setStage("closing");

    // Step 2: Once doors meet in the center (~700ms), smoothly shrink the assembly back into the button
    closeTimerRef.current = setTimeout(() => {
      setStage("shrinking");

      // Step 3: Once collapsed back into button (~520ms), unmount portal cleanly
      closeTimerRef.current = setTimeout(() => {
        setStage("closed");
        document.body.style.overflow = "";
      }, 520);
    }, 700);
  }, [calculateOrigin]);

  // Listen for Escape key
  useEffect(() => {
    if (stage === "closed") return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeResume();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, closeResume]);

  // Clean up timers & overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={openResume}
        className="group relative px-8 py-3.5 rounded-full border border-white/20 bg-white/[0.04] text-white font-medium text-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-blue-500/10 active:scale-95"
      >
        <span className="flex items-center gap-2">
          <span>View Resume</span>
          <span className="text-xs text-blue-400 transition-transform duration-300 group-hover:scale-125">✦</span>
        </span>
      </button>

      {stage !== "closed" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`resume-door-overlay resume-stage-${stage}`}
            style={{
              "--origin-x": `${origin.x}px`,
              "--origin-y": `${origin.y}px`,
              "--scale-x": origin.scaleX,
              "--scale-y": origin.scaleY,
            }}
            onClick={(e) => {
              if (
                e.target === e.currentTarget ||
                (e.target.classList && e.target.classList.contains("resume-page-backdrop"))
              ) {
                closeResume();
              }
            }}
          >
            {/* Dark glass backdrop with smooth cinematic fade */}
            <div className="resume-page-backdrop" />

            {/* Resume Document Viewer */}
            <div className="resume-document-wrapper">
              {/* Floating Top Control Bar */}
              <div className="resume-toolbar">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
                  <span className="text-xs md:text-sm font-medium text-gray-200 truncate">
                    <span className="hidden sm:inline">Vivek Mittal &bull; Full Stack Developer Resume</span>
                    <span className="inline sm:hidden">Resume</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                  {/* Zoom Controls (+ / - / Reset) */}
                  <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 text-xs text-gray-300">
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      disabled={zoomScale <= 1.0}
                      className="h-6 w-6 flex items-center justify-center rounded-full text-sm font-bold hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Zoom Out"
                      aria-label="Zoom Out"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={handleZoomReset}
                      className="px-1.5 font-mono text-[11px] font-semibold hover:text-blue-400 transition-colors"
                      title="Reset Zoom to 100%"
                    >
                      {Math.round(zoomScale * 100)}%
                    </button>
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      disabled={zoomScale >= 2.5}
                      className="h-6 w-6 flex items-center justify-center rounded-full text-sm font-bold hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Zoom In"
                      aria-label="Zoom In"
                    >
                      +
                    </button>
                  </div>

                  <a
                    href="/resume.pdf?v=20261119"
                    download="Vivek_Mittal_Resume.pdf"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 text-xs text-gray-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-white"
                    title="Download PDF"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="hidden md:inline">Download</span>
                  </a>

                  <a
                    href="/resume.pdf?v=20261119"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 text-xs text-gray-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-white"
                    title="Open in new tab"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="hidden md:inline">New Tab</span>
                  </a>

                  <button
                    type="button"
                    onClick={closeResume}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-red-500/20 hover:border-red-400/50 active:scale-95"
                    aria-label="Close resume"
                  >
                    <span>Close</span>
                    <span className="text-gray-400 text-[10px] hidden md:inline">[ESC]</span>
                  </button>
                </div>
              </div>

              {/* PDF Container */}
              <div className="resume-document">
                {isMobile ? (
                  /* Mobile view: Direct crisp retina preview with pinch-to-zoom, momentum scrolling & zero waste scrollbars */
                  <div
                    className={`w-full h-full p-2 sm:p-4 bg-[#0d1117] flex flex-col items-center select-none overscroll-contain ${
                      zoomScale > 1 ? "overflow-auto" : "overflow-y-auto overflow-x-hidden"
                    }`}
                    style={{
                      WebkitOverflowScrolling: "touch",
                      touchAction: zoomScale > 1 ? "pan-x pan-y pinch-zoom" : "pan-y pinch-zoom",
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className="transition-transform duration-100 ease-out flex justify-center w-full"
                      style={{
                        transform: zoomScale > 1 ? `scale(${zoomScale})` : "none",
                        transformOrigin: "top center",
                        margin: zoomScale > 1 ? `${(zoomScale - 1) * 30}% 0` : "0",
                      }}
                    >
                      <img
                        src="/resume-preview.png?v=20261119c"
                        alt="Vivek Mittal - Full Stack Developer Resume"
                        className="w-full h-auto max-w-[850px] rounded-lg shadow-2xl object-contain block mx-auto pointer-events-auto"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                ) : (
                  /* Desktop view: Native interactive PDF iframe */
                  <div className="w-full h-full">
                    <iframe
                      src={resumeUrl}
                      title="Vivek Mittal Resume"
                      className="w-full h-full border-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Door Assembly that emerges from and shrinks back into the button */}
            <div className="resume-doors-assembly">
              <div className="resume-door resume-door-left">
                <div className="door-panel">
                  <div className="door-inner-border" />
                  <div className="door-seam-glow" />
                  <div className="door-handle" />
                </div>
              </div>

              <div className="resume-door resume-door-right">
                <div className="door-panel">
                  <div className="door-inner-border" />
                  <div className="door-seam-glow" />
                  <div className="door-handle" />
                </div>
              </div>

              {/* Center Seam Energy Light */}
              <div className="door-light" />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
