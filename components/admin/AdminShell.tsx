"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { AdminIdentity } from "@/lib/types";

const navigation = [
  { label: "Overview", href: "/admin" },
  { label: "Visitors", href: "/admin/visitors" },
  { label: "Resume downloads", href: "/admin/resume-downloads" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Admin / Profile", href: "/admin/profile" },
];

export default function AdminShell({
  admin,
  children,
}: {
  admin: AdminIdentity;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
    }
  }

  return (
    <div className="min-h-screen bg-[#08090b] text-white md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 bg-black p-5 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <Link className="text-sm font-semibold tracking-wide" href="/admin">
          Vivek <span className="text-blue-400">/ Admin</span>
        </Link>
        <p className="mt-6 truncate text-xs text-gray-500">{admin.email}</p>
        <nav
          aria-label="Admin navigation"
          className="mt-5 flex gap-2 overflow-x-auto md:flex-col"
        >
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 border-l-2 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-blue-400 bg-white/[0.05] text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="mt-5 border-l-2 border-transparent px-3 py-2 text-left text-sm text-gray-400 transition-colors hover:text-white disabled:opacity-50 md:mt-8"
          disabled={isLoggingOut}
          onClick={logout}
          type="button"
        >
          {isLoggingOut ? "Signing out..." : "Log out"}
        </button>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
            Portfolio control panel
          </p>
          <p className="text-sm text-gray-400">{admin.displayName}</p>
        </header>
        {children}
      </main>
    </div>
  );
}
