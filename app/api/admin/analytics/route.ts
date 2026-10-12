import { NextResponse } from "next/server";
import { authorizeAdminApi } from "@/lib/admin-api";
import { getAnalyticsData } from "@/lib/admin-data";

export async function GET(request: Request) {
  const access = await authorizeAdminApi(request);
  if (access.response) return access.response;

  try {
    return NextResponse.json(await getAnalyticsData(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Analytics are unavailable." },
      { status: 503 },
    );
  }
}
