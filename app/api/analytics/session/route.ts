import { NextResponse } from "next/server";
import { connectDatabase, isDatabaseConfigured } from "@/lib/db";
import { VisitorSession } from "@/lib/models";
import { allowRateLimit, isSameOrigin } from "@/lib/security";
import { readJsonBody } from "@/lib/admin-api";
import { sessionDurationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  }
  if (!isDatabaseConfigured())
    return NextResponse.json({ ok: true }, { status: 202 });

  const parsed = sessionDurationSchema.safeParse(
    await readJsonBody(request, 2_000),
  );
  if (!parsed.success)
    return NextResponse.json({ message: "Invalid event." }, { status: 400 });

  try {
    const allowed = await allowRateLimit(
      request,
      "session-duration",
      20,
      60_000,
      parsed.data.anonymousId,
    );
    if (!allowed) return NextResponse.json({ ok: true }, { status: 202 });

    await connectDatabase();
    await VisitorSession.updateOne(
      { anonymousId: parsed.data.anonymousId },
      { $max: { durationSeconds: parsed.data.durationSeconds } },
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }, { status: 202 });
  }
}
