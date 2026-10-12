import { NextResponse } from "next/server";
import { connectDatabase, isDatabaseConfigured } from "@/lib/db";
import { getVisitorContext } from "@/lib/attribution";
import { PageView, VisitorSession } from "@/lib/models";
import { allowRateLimit, isSameOrigin } from "@/lib/security";
import { pageViewSchema } from "@/lib/validation";
import { readJsonBody } from "@/lib/admin-api";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  }
  if (!isDatabaseConfigured())
    return NextResponse.json({ ok: true, disabled: true }, { status: 202 });

  const parsed = pageViewSchema.safeParse(await readJsonBody(request, 8_000));
  if (!parsed.success)
    return NextResponse.json({ message: "Invalid event." }, { status: 400 });

  try {
    const allowed = await allowRateLimit(
      request,
      "page-view",
      120,
      60_000,
      parsed.data.anonymousId,
    );
    if (!allowed) return NextResponse.json({ ok: true }, { status: 202 });

    const { anonymousId, path, referrer, utmSource, utmMedium, utmCampaign } =
      parsed.data;
    const context = getVisitorContext(request.headers, referrer, {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
    });
    const now = new Date();

    await connectDatabase();
    await Promise.all([
      VisitorSession.updateOne(
        { anonymousId },
        {
          $set: {
            lastSeenAt: now,
            country: context.country,
            region: context.region,
            city: context.city,
            browser: context.browser,
            operatingSystem: context.operatingSystem,
            device: context.device,
          },
          $setOnInsert: {
            firstSeenAt: now,
            landingPage: path,
            source: context.source,
            referringDomain: context.referringDomain,
            utmSource: context.utmSource,
            utmMedium: context.utmMedium,
            utmCampaign: context.utmCampaign,
            durationSeconds: 0,
          },
          $push: { pagesVisited: { $each: [path], $slice: -100 } },
          $inc: { viewCount: 1 },
        },
        { upsert: true },
      ),
      PageView.create({
        anonymousId,
        path,
        source: context.source,
        viewedAt: now,
      }),
    ]);

    const response = NextResponse.json({ ok: true });
    response.cookies.set("portfolio_visitor", anonymousId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: true, disabled: true }, { status: 202 });
  }
}
