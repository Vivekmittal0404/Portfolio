"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const VISITOR_KEY = "portfolio_anonymous_visitor";
const STARTED_KEY = "portfolio_visit_started_at";
function getAnonymousId() {
  const stored = sessionStorage.getItem(VISITOR_KEY);
  if (
    stored &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      stored,
    )
  ) {
    return stored;
  }

  const id = crypto.randomUUID();
  sessionStorage.setItem(VISITOR_KEY, id);
  return id;
}

export default function PortfolioTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    let anonymousId: string;
    let startedAt: number;
    try {
      anonymousId = getAnonymousId();
      const savedStart = Number(sessionStorage.getItem(STARTED_KEY));
      startedAt =
        Number.isFinite(savedStart) && savedStart > 0 ? savedStart : Date.now();
      sessionStorage.setItem(STARTED_KEY, String(startedAt));
    } catch {
      return;
    }

    const url = new URL(window.location.href);
    const payload = {
      anonymousId,
      path: pathname,
      referrer: document.referrer,
      utmSource: url.searchParams.get("utm_source") ?? "",
      utmMedium: url.searchParams.get("utm_medium") ?? "",
      utmCampaign: url.searchParams.get("utm_campaign") ?? "",
    };
    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    };

    void fetch("/api/analytics/page-view", requestOptions).catch(
      () => undefined,
    );

    const sendDuration = () => {
      const durationSeconds = Math.min(
        86400,
        Math.floor((Date.now() - startedAt) / 1000),
      );
      void fetch("/api/analytics/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonymousId, durationSeconds }),
        keepalive: true,
      }).catch(() => undefined);
    };

    const durationTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") sendDuration();
    }, 30_000);
    window.addEventListener("pagehide", sendDuration);

    return () => {
      window.clearInterval(durationTimer);
      window.removeEventListener("pagehide", sendDuration);
    };
  }, [pathname]);

  return null;
}
