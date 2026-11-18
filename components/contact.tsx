"use client";
import { useState, useEffect, useRef } from "react";

/* =========================================================
   CONTACT
========================================================= */

export default function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [isInView, setIsInView] = useState(false);
  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType | null>(null);
  const [StarsComponent, setStarsComponent] = useState<React.ComponentType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Load heavy Three.js only when the user scrolls near the contact section
          import("./ContactGlobe").then((m) => setGlobeComponent(() => m.default));
          import("./ContactStars").then((m) => setStarsComponent(() => m.default));
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSending(true);
    setFormMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get("name") as string) || "";
    const email = (formData.get("email") as string) || "";
    const subject = (formData.get("subject") as string) || "New Message from Portfolio Visitor";
    const message = (formData.get("message") as string) || "";

    // Client-side Web3Forms submission (guaranteed delivery to Vivek's email)
    const web3Data = new FormData();
    web3Data.append("access_key", "fb9b7dc0-06b8-433a-b07e-65bc319dec31");
    web3Data.append("name", name);
    web3Data.append("email", email);
    web3Data.append("subject", subject);
    web3Data.append("message", message);
    web3Data.append("from_name", name || "Portfolio Contact");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3Data,
      });

      const data = await response.json();

      if (data.success || response.ok) {
        setFormMessage("Message sent successfully! I'll get back to you soon.");
        form.reset();

        // Asynchronously save to internal database without blocking the user
        void fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        }).catch(() => undefined);
      } else {
        setFormMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      // Fallback: try internal API if direct Web3Forms request encountered network issue
      try {
        const fallbackRes = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && fallbackData.ok) {
          setFormMessage("Message sent successfully! I'll get back to you soon.");
          form.reset();
        } else {
          setFormMessage("Unable to send the message. Please try again.");
        }
      } catch {
        setFormMessage("Unable to send the message. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  };
  return (
    <section
      ref={sectionRef}
      id="contact"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-black
        text-white
      "
    >
      {isInView && StarsComponent && <StarsComponent />}

      {/* =====================================
    CONTENT
===================================== */}

      <div
        className="
    relative
    z-10
    mx-auto
    flex
    min-h-screen
    w-full
    max-w-7xl
    items-center
    px-6
    py-8
    sm:py-10
    lg:px-10
    lg:py-20
  "
      >
        <div
          className="
      grid
      w-full
      items-center
      gap-10
      lg:grid-cols-[0.9fr_1.1fr]
    "
        >
          {/* =================================
        LEFT SIDE
        TEXT + FORM
    ================================= */}

          <div
            className="
        relative
        z-30
        flex
        w-full
        max-w-xl
        flex-col
        justify-center
      "
          >
            {/* ===============================
          EXISTING DESIGN TEXT
      =============================== */}

            <div>
              <p
                className="
            mb-5
            text-xs
            font-medium
            uppercase
            tracking-[0.4em]
            text-cyan-300
          "
              >
                Get in touch
              </p>

              <h2
                className="
            text-5xl
            font-semibold
            leading-[1.05]
            sm:text-6xl
          "
              >
                Let&apos;s build
                <br />
                something
                <br />
                <span className="text-cyan-300">meaningful.</span>
              </h2>

              <p
                className="
            mt-6
            max-w-lg
            text-sm
            leading-7
            text-white/50
            sm:text-base
          "
              >
                Have an idea, project, opportunity, or just want to say hello?
                <br />
                Send me a message and I&apos;ll get back to you.
              </p>
            </div>

            {/* ===============================
          CONTACT FORM
          NOW BELOW THE TEXT
      =============================== */}

            <form
              onSubmit={handleSubmit}
              className="
          mt-10
          w-full
              rotating-border
          rounded-3xl
          border
          border-white/[0.10]
          bg-black/75
          p-6
          shadow-2xl
          backdrop-blur-xl
          sm:p-7
        "
            >
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
              />
              {/* Name + Email */}

              <div
                className="
            grid
            gap-5
            sm:grid-cols-2
          "
              >
                {/* Name */}

                <label>
                  <span
                    className="
                mb-2
                block
                text-xs
                text-white/60
              "
                  >
                    Your Name
                  </span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    className="
                h-11
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                px-4
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-cyan-300/50
              "
                  />
                </label>

                {/* Email */}

                <label>
                  <span
                    className="
                mb-2
                block
                text-xs
                text-white/60
              "
                  >
                    Your Email
                  </span>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="
                h-11
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                px-4
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-cyan-300/50
              "
                  />
                </label>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs text-white/60">
                  Subject
                </span>
                <input
                  type="text"
                  name="subject"
                  placeholder="What is this about?"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/50"
                  maxLength={120}
                />
              </label>

              {/* Message */}

              <label className="mt-5 block">
                <span
                  className="
              mb-2
              block
              text-xs
              text-white/60
            "
                >
                  Message
                </span>

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  required
                  className="
              w-full
              resize-none
              rounded-xl
              border
              border-white/10
              bg-white/[0.035]
              px-4
              py-3
              text-sm
              text-white
              outline-none
              transition
              placeholder:text-white/25
              focus:border-cyan-300/50
            "
                />
              </label>

              {/* Send */}

              <button
                type="submit"
                disabled={isSending}
                className="
    mt-5
    h-11
    w-full
    rounded-xl
    bg-white
    text-sm
    font-medium
    text-black
    transition
    hover:bg-cyan-100
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
              >
                {isSending ? "Sending..." : "Send message"}
              </button>
              {formMessage && (
                <p className="mt-4 text-center text-sm text-white/70">
                  {formMessage}
                </p>
              )}
            </form>
          </div>

          {/* =================================
        RIGHT SIDE
        EARTH + RIBBONS
    ================================= */}

          <div className="pointer-events-none relative h-72 w-full sm:h-96 lg:h-[620px]">
            {isInView && GlobeComponent && <GlobeComponent />}
          </div>
        </div>
      </div>
    </section>
  );
}
