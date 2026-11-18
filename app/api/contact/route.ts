import { NextResponse } from "next/server";
import { getVisitorContext } from "@/lib/attribution";
import { connectDatabase, isDatabaseConfigured } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { allowRateLimit, isSameOrigin } from "@/lib/security";
import { contactSchema } from "@/lib/validation";
import { readJsonBody } from "@/lib/admin-api";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  }

  const parsed = contactSchema.safeParse(await readJsonBody(request, 8_000));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Check your name, email, and message." },
      { status: 400 },
    );
  }
  if (parsed.data.botcheck) return NextResponse.json({ ok: true });

  // Optional rate limiting if database is available
  try {
    if (isDatabaseConfigured()) {
      const allowed = await allowRateLimit(
        request,
        "contact-submit",
        10,
        60 * 60 * 1000,
      );
      if (!allowed) {
        return NextResponse.json(
          { message: "Please wait before sending another message." },
          { status: 429 },
        );
      }
    }
  } catch {
    // Non-fatal if rate-limit collection is offline
  }

  // Attempt database persistence (non-blocking for visitor)
  if (isDatabaseConfigured()) {
    try {
      await connectDatabase();
      const context = getVisitorContext(request.headers);
      await ContactMessage.create({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        submittedAt: new Date(),
        country: context.country,
        region: context.region,
        city: context.city,
        source: context.source,
        referringDomain: context.referringDomain,
      });
    } catch (dbError) {
      console.warn("Could not save to MongoDB:", dbError);
    }
  }

  return NextResponse.json({ ok: true });
}
