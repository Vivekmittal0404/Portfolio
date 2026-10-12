"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSettings({
  initialName,
  email,
  lastLoginAt,
}: {
  initialName: string;
  email: string;
  lastLoginAt: string | null;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setProfileMessage("");
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(result.message ?? "Unable to update profile.");
      setProfileMessage("Profile updated.");
    } catch (cause) {
      setProfileMessage(
        cause instanceof Error ? cause.message : "Unable to update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");
    try {
      const response = await fetch("/api/admin/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(result.message ?? "Unable to update password.");
      setPasswordMessage(
        "Password updated. Sign in again with the new password.",
      );
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch (cause) {
      setPasswordMessage(
        cause instanceof Error ? cause.message : "Unable to update password.",
      );
    }
  }

  const fieldClass =
    "mt-2 h-11 w-full border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-blue-400/60";
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <form
        className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
        onSubmit={saveProfile}
      >
        <h2 className="text-base font-medium">Profile</h2>
        <p className="mt-2 text-sm text-gray-500">{email}</p>
        <label className="mt-6 block text-xs text-gray-400">
          Display name
          <input
            className={fieldClass}
            maxLength={80}
            minLength={2}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            value={displayName}
          />
        </label>
        {lastLoginAt && (
          <p className="mt-4 text-xs text-gray-600">
            Last sign-in: {new Date(lastLoginAt).toLocaleString()}
          </p>
        )}
        {profileMessage && (
          <p aria-live="polite" className="mt-4 text-sm text-blue-200">
            {profileMessage}
          </p>
        )}
        <button
          className="mt-5 h-10 bg-white px-4 text-sm font-medium text-black disabled:opacity-50"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>

      <form
        className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
        onSubmit={changePassword}
      >
        <h2 className="text-base font-medium">Change password</h2>
        <label className="mt-6 block text-xs text-gray-400">
          Current password
          <input
            autoComplete="current-password"
            className={fieldClass}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            type="password"
            value={currentPassword}
          />
        </label>
        <label className="mt-4 block text-xs text-gray-400">
          New password
          <input
            autoComplete="new-password"
            className={fieldClass}
            minLength={12}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            type="password"
            value={newPassword}
          />
        </label>
        {passwordMessage && (
          <p aria-live="polite" className="mt-4 text-sm text-gray-300">
            {passwordMessage}
          </p>
        )}
        <button
          className="mt-5 h-10 border border-white/15 px-4 text-sm text-white transition-colors hover:bg-white/[0.06]"
          type="submit"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
