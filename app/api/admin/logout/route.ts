import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  }

  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
