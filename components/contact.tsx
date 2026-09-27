"use client";
import ContactGlobe from "./ContactGlobe";
import ContactStars from "./ContactStars";
import { useState } from "react";

/* =========================================================
   CONTACT
========================================================= */

export default function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSending(true);
    setFormMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append("access_key", "fb9b7dc0-06b8-433a-b07e-65bc319dec31");

    formData.append("subject", "New Portfolio Contact Message");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormMessage("Message sent successfully! I'll get back to you soon.");

        form.reset();
      } else {
        setFormMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      setFormMessage("Unable to send the message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <section
      id="contact"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-black
        text-white
      "
    >
      <ContactStars />

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
    py-20
    lg:px-10
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
                    name="name"
                    placeholder="you@example.com"
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
                  name="name"
                  rows={5}
                  placeholder="Tell me about your project..."
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

          <div
            className="pointer-events-none relative hidden w-full lg:block"
            style={{ height: "620px" }}
          >
            <ContactGlobe />
          </div>
        </div>
      </div>
    </section>
  );
}
