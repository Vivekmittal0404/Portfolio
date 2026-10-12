import "server-only";

export type Attribution = {
  source: string;
  referringDomain: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export type VisitorContext = Attribution & {
  country: string | null;
  region: string | null;
  city: string | null;
  browser: string;
  operatingSystem: string;
  device: string;
};

function geoValue(value: unknown) {
  if (typeof value === "string") return value.slice(0, 100);
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  for (const key of ["name", "code"]) {
    if (typeof record[key] === "string") return record[key].slice(0, 100);
  }
  return null;
}

function normalizeDomain(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .slice(0, 253);
  } catch {
    return null;
  }
}

function classifySource(domain: string | null, utmSource: string | null) {
  const candidate = `${utmSource ?? ""} ${domain ?? ""}`.toLowerCase();
  if (/google/.test(candidate)) return "Google";
  if (/linkedin/.test(candidate)) return "LinkedIn";
  if (/github/.test(candidate)) return "GitHub";
  if (/facebook|fb\.com/.test(candidate)) return "Facebook";
  if (/instagram/.test(candidate)) return "Instagram";
  if (!domain && !utmSource) return "Direct";
  return utmSource?.slice(0, 100) || "Other";
}

export function getAttribution(
  headers: Headers,
  referrerValue = "",
  utmValues: { source?: string; medium?: string; campaign?: string } = {},
): Attribution {
  const referrerDomain = normalizeDomain(
    referrerValue || headers.get("referer") || "",
  );
  const currentHost = headers.get("x-forwarded-host") ?? headers.get("host");
  const normalizedCurrentHost = currentHost
    ? normalizeDomain(`https://${currentHost}`)
    : null;
  const externalDomain =
    referrerDomain && referrerDomain !== normalizedCurrentHost
      ? referrerDomain
      : null;
  const utmSource = utmValues.source?.trim().slice(0, 100) || null;

  return {
    source: classifySource(externalDomain, utmSource),
    referringDomain: externalDomain,
    utmSource,
    utmMedium: utmValues.medium?.trim().slice(0, 100) || null,
    utmCampaign: utmValues.campaign?.trim().slice(0, 150) || null,
  };
}

function getGeoHeaders(headers: Headers) {
  let netlifyGeo: Record<string, unknown> = {};
  const encodedGeo = headers.get("x-nf-geo");
  if (encodedGeo) {
    try {
      const parsed: unknown = JSON.parse(encodedGeo);
      if (parsed && typeof parsed === "object") {
        netlifyGeo = parsed as Record<string, unknown>;
      }
    } catch {
      netlifyGeo = {};
    }
  }

  const country =
    headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry");
  const region = headers.get("x-vercel-ip-country-region");
  const city = headers.get("x-vercel-ip-city");
  const geoCountry = geoValue(netlifyGeo.country);
  const geoSubdivision = geoValue(netlifyGeo.subdivision);
  const geoCity = geoValue(netlifyGeo.city);

  return {
    country: country?.slice(0, 80) ?? geoCountry?.slice(0, 80) ?? null,
    region: region?.slice(0, 100) ?? geoSubdivision,
    city: city?.slice(0, 100) ?? geoCity,
  };
}

export function getVisitorContext(
  headers: Headers,
  referrer = "",
  utmValues: { source?: string; medium?: string; campaign?: string } = {},
): VisitorContext {
  const userAgent = headers.get("user-agent") ?? "";
  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /Firefox\//.test(userAgent)
      ? "Firefox"
      : /Chrome\//.test(userAgent)
        ? "Chrome"
        : /Safari\//.test(userAgent)
          ? "Safari"
          : "Unknown";
  const operatingSystem = /Windows/i.test(userAgent)
    ? "Windows"
    : /Android/i.test(userAgent)
      ? "Android"
      : /iPhone|iPad|iPod/i.test(userAgent)
        ? "iOS"
        : /Mac OS/i.test(userAgent)
          ? "macOS"
          : /Linux/i.test(userAgent)
            ? "Linux"
            : "Unknown";
  const device = /iPad|Tablet/i.test(userAgent)
    ? "Tablet"
    : /Mobile|iPhone|Android/i.test(userAgent)
      ? "Mobile"
      : userAgent
        ? "Desktop"
        : "Unknown";

  return {
    ...getAttribution(headers, referrer, utmValues),
    ...getGeoHeaders(headers),
    browser,
    operatingSystem,
    device,
  };
}
