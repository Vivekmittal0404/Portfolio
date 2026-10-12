"use client";

import { useState, type FormEvent } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  submittedAt: string;
  country: string | null;
  region: string | null;
  city: string | null;
  source: string;
  referringDomain: string | null;
};

export default function MessageManager({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const selected =
    messages.find((message) => message.id === selectedId) ?? null;
  const visible = messages.filter((message) =>
    filter === "unread"
      ? !message.isRead
      : filter === "read"
        ? message.isRead
        : true,
  );

  async function searchMessages(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(
        `/api/admin/messages?search=${encodeURIComponent(search)}`,
        {
          cache: "no-store",
        },
      );
      if (!response.ok) throw new Error("Search is unavailable.");
      setMessages((await response.json()) as Message[]);
      setSelectedId(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Search is unavailable.",
      );
    }
  }

  async function setRead(message: Message, isRead: boolean) {
    setBusyId(message.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });
      if (!response.ok) throw new Error("Unable to update message.");
      setMessages((current) =>
        current.map((row) =>
          row.id === message.id ? { ...row, isRead } : row,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to update message.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteMessage(message: Message) {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;
    setBusyId(message.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete message.");
      setMessages((current) => current.filter((row) => row.id !== message.id));
      if (selectedId === message.id) setSelectedId(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to delete message.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <form
          className="flex min-w-0 flex-1 flex-wrap gap-2"
          onSubmit={searchMessages}
        >
          <label className="sr-only" htmlFor="message-search">
            Search messages
          </label>
          <input
            className="h-10 min-w-[220px] flex-1 border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-blue-400/60"
            id="message-search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, subject, message"
            value={search}
          />
          <button
            className="h-10 border border-white/15 px-4 text-sm text-gray-200 transition-colors hover:bg-white/[0.06]"
            type="submit"
          >
            Search
          </button>
        </form>
        <label className="text-xs text-gray-500">
          Filter
          <select
            className="ml-2 h-10 border border-white/10 bg-black px-3 text-sm text-white"
            onChange={(event) => setFilter(event.target.value)}
            value={filter}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </label>
      </div>

      {error && (
        <p aria-live="polite" className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}

      {selected && (
        <section className="mb-6 border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-400">
                Message details
              </p>
              <h2 className="mt-2 text-lg font-semibold">{selected.subject}</h2>
              <p className="mt-1 text-sm text-gray-400">
                {selected.name} ·{" "}
                <a
                  className="hover:text-white"
                  href={`mailto:${selected.email}`}
                >
                  {selected.email}
                </a>
              </p>
            </div>
            <button
              className="text-sm text-gray-400 hover:text-white"
              onClick={() => setSelectedId(null)}
              type="button"
            >
              Close
            </button>
          </div>
          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-300">
            {selected.message}
          </p>
          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-gray-500">
            {new Date(selected.submittedAt).toLocaleString()} ·{" "}
            {[selected.city, selected.region, selected.country]
              .filter(Boolean)
              .join(", ") || "Location unavailable"}{" "}
            · {selected.source}
            {selected.referringDomain ? ` (${selected.referringDomain})` : ""}
          </p>
          <p className="text-xs text-gray-600">
            No anonymous visitor ID is associated with this contact message.
          </p>
        </section>
      )}

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((message) => (
              <tr className="border-t border-white/10" key={message.id}>
                <td className="px-4 py-3">
                  <button
                    className="text-left text-gray-200 hover:text-blue-300"
                    onClick={() => setSelectedId(message.id)}
                    type="button"
                  >
                    {message.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-400">{message.email}</td>
                <td className="max-w-[240px] truncate px-4 py-3 text-gray-300">
                  {message.subject}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {new Date(message.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {message.isRead ? "Read" : "Unread"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 whitespace-nowrap">
                    <button
                      className="text-xs text-blue-300 hover:text-white disabled:opacity-50"
                      disabled={busyId === message.id}
                      onClick={() => void setRead(message, !message.isRead)}
                      type="button"
                    >
                      Mark {message.isRead ? "unread" : "read"}
                    </button>
                    <button
                      className="text-xs text-red-300 hover:text-red-200 disabled:opacity-50"
                      disabled={busyId === message.id}
                      onClick={() => void deleteMessage(message)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-gray-500" colSpan={6}>
                  No messages match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
