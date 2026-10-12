import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getVisitorContext } from "@/lib/attribution";
import { connectDatabase, isDatabaseConfigured } from "@/lib/db";
import { ResumeDownload, VisitorSession } from "@/lib/models";
import { allowRateLimit } from "@/lib/security";

export async function GET(request: Request) {
  const destination = new URL("/resume.pdf", request.url);
  const cookieStore = await cookies();
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const requestedId = new URL(request.url).searchParams.get("visitor") ?? "";
  const cookieId = cookieStore.get("portfolio_visitor")?.value ?? "";
  const anonymousId = uuidPattern.test(requestedId)
    ? requestedId
    : uuidPattern.test(cookieId)
      ? cookieId
      : crypto.randomUUID();

  if (isDatabaseConfigured()) {
    try {
      const [ipAllowed, visitorAllowed] = await Promise.all([
        allowRateLimit(request, "resume-download-ip", 20, 60_000),
        allowRateLimit(
          request,
          "resume-download-visitor",
          20,
          60_000,
          anonymousId,
        ),
      ]);
      if (ipAllowed && visitorAllowed) {
        await connectDatabase();
        const session = await VisitorSession.findOne({ anonymousId }).lean();
        const fallback = getVisitorContext(request.headers);
        await ResumeDownload.create({
          anonymousId,
          downloadedAt: new Date(),
          country: session?.country ?? fallback.country,
          region: session?.region ?? fallback.region,
          city: session?.city ?? fallback.city,
          browser: session?.browser ?? fallback.browser,
          operatingSystem: session?.operatingSystem ?? fallback.operatingSystem,
          device: session?.device ?? fallback.device,
          source: session?.source ?? fallback.source,
          referringDomain: session?.referringDomain ?? fallback.referringDomain,
          utmSource: session?.utmSource ?? fallback.utmSource,
          utmMedium: session?.utmMedium ?? fallback.utmMedium,
          utmCampaign: session?.utmCampaign ?? fallback.utmCampaign,
        });
      }
    } catch {
      // Keep the existing resume experience available if analytics storage is offline.
    }
  }

  const response = NextResponse.redirect(destination, 302);
  if (cookieStore.get("portfolio_visitor")?.value !== anonymousId) {
    response.cookies.set("portfolio_visitor", anonymousId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
  }
  return response;
}
