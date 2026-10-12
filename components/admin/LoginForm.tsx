"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Unable to sign in.");
        return;
      }

      router.replace("/admin");
    } catch {
      setMessage("Unable to reach the server. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <label className="block text-sm text-gray-300">
        Email
        <input
          autoComplete="username"
          className="mt-2 h-11 w-full border border-white/10 bg-black px-3 text-white outline-none focus:border-blue-400/60"
          name="email"
          required
          type="email"
        />
      </label>
      <label className="block text-sm text-gray-300">
        Password
        <input
          autoComplete="current-password"
          className="mt-2 h-11 w-full border border-white/10 bg-black px-3 text-white outline-none focus:border-blue-400/60"
          name="password"
          required
          type="password"
        />
      </label>
      {message && (
        <p aria-live="polite" className="text-sm text-red-300">
          {message}
        </p>
      )}
      <button
        className="h-11 w-full bg-white text-sm font-medium text-black transition-colors hover:bg-blue-100 disabled:cursor-wait disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
