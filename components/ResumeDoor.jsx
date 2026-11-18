"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useCallback, useRef } from "react";

export default function ResumeDoor({ buttonRef }) {
  // stages: "closed" -> "expanding" -> "expanded" -> "opened" -> "closing" -> "shrinking" -> "closed"
  const [stage, setStage] = useState("closed");
  const [origin, setOrigin] = useState({ x: 0, y: 0, scaleX: 0.15, scaleY: 0.05 });
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf?v=20261118");
  const [pdfLoading, setPdfLoading] = useState(true);
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const canvasRef = useRef(null);

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

  // Pre-render PDF on mobile canvas directly without the browser "Open PDF" prompt
  useEffect(() => {
    if (stage === "closed") return;

    let isMounted = true;
    setPdfLoading(true);

    const renderPdfOnMobile = async () => {
      try {
        if (!window.pdfjsLib) {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.async = true;
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (!window.pdfjsLib || !isMounted) return;
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const loadingTask = window.pdfjsLib.getDocument("/resume.pdf?v=20261118");
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (!isMounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const unscaledViewport = page.getViewport({ scale: 1 });

        const containerWidth =
          canvas.parentElement?.clientWidth || window.innerWidth || 360;
        const dpr = Math.min(window.devicePixelRatio || 2, 2.5);
        const scale = ((containerWidth - 16) / unscaledViewport.width) * dpr;
        const viewport = page.getViewport({ scale: Math.max(1.8, scale) });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "auto";

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        if (isMounted) {
          setPdfLoading(false);
        }
      } catch (err) {
        console.warn("Mobile PDF canvas render notice:", err);
        if (isMounted) setPdfLoading(false);
      }
    };

    renderPdfOnMobile();

    return () => {
      isMounted = false;
    };
  }, [stage]);

  const openResume = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (openTimerRef.current) clearTimeout(openTimerRef.current);

    const anonymousId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("portfolio_anonymous_visitor")
        : null;
    
    // Asynchronously record download/view metric without delaying iframe render
    if (typeof window !== "undefined") {
      const trackUrl = anonymousId
        ? `/api/resume/download?visitor=${encodeURIComponent(anonymousId)}`
        : "/api/resume/download";
      void fetch(trackUrl, { method: "GET", keepalive: true }).catch(() => undefined);
    }
    setResumeUrl(`/resume.pdf?v=20261118`);

    // Calculate exact button position to emerge from
    const coords = calculateOrigin();
    setOrigin(coords);

    document.body.style.overflow = "hidden";
    // Stage 1: Mount collapsed at the exact button coordinates
    setStage("expanding");

    // Stage 2: Expand smoothly from button to full screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStage("expanded");
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
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs md:text-sm font-medium text-gray-200">
                    Vivek Mittal &bull; Full Stack Developer Resume
                  </span>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <a
                    href="/resume.pdf?v=20261118"
                    download="Vivek_Mittal_Resume.pdf"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-gray-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-white"
                    title="Download PDF"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="hidden sm:inline">Download</span>
                  </a>

                  <a
                    href="/resume.pdf?v=20261118"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-gray-300 transition-all hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-white"
                    title="Open in new tab"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="hidden sm:inline">New Tab</span>
                  </a>

                  <button
                    type="button"
                    onClick={closeResume}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-red-500/20 hover:border-red-400/50 active:scale-95"
                    aria-label="Close resume"
                  >
                    <span>Close</span>
                    <span className="text-gray-400 text-[10px] hidden sm:inline">[ESC]</span>
                  </button>
                </div>
              </div>

              {/* PDF Container */}
              <div className="resume-document">
                {/* Desktop view: native interactive PDF iframe */}
                <div className="hidden md:block w-full h-full">
                  <iframe src={resumeUrl} title="Vivek Mittal Resume" className="w-full h-full border-none" />
                </div>

                {/* Mobile view: direct Canvas rendering via Mozilla PDF.js */}
                {/* Eliminates the Android/iOS "Open PDF" prompt and displays the resume directly */}
                <div className="block md:hidden w-full h-full overflow-y-auto overflow-x-hidden p-2 sm:p-3 bg-[#0d1117]">
                  {pdfLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                      <div className="h-8 w-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium text-gray-300">
                        Opening Resume...
                      </span>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    className={`w-full h-auto rounded-lg shadow-xl mx-auto block transition-opacity duration-300 ${
                      pdfLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                </div>
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
