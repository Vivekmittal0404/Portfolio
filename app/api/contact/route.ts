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
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "Contact submissions are temporarily unavailable." },
      { status: 503 },
    );
  }

  const parsed = contactSchema.safeParse(await readJsonBody(request, 8_000));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Check your name, email, and message." },
      { status: 400 },
    );
  }
  if (parsed.data.botcheck) return NextResponse.json({ ok: true });

  try {
    const allowed = await allowRateLimit(
      request,
      "contact-submit",
      5,
      60 * 60 * 1000,
    );
    if (!allowed) {
      return NextResponse.json(
        { message: "Please wait before sending another message." },
        { status: 429 },
      );
    }

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

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (accessKey) {
      const form = new FormData();
      form.set("access_key", accessKey);
      form.set("name", parsed.data.name);
      form.set("email", parsed.data.email);
      form.set("subject", parsed.data.subject);
      form.set("message", parsed.data.message);
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: form,
          signal: AbortSignal.timeout(5000),
        });
      } catch {
        // The message is already stored for the admin inbox.
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to store your message. Please try again." },
      { status: 503 },
    );
  }
}
