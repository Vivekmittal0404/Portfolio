import { NextResponse } from "next/server";
import { authorizeAdminApi } from "@/lib/admin-api";
import { getOverviewData } from "@/lib/admin-data";

export async function GET(request: Request) {
  const access = await authorizeAdminApi(request);
  if (access.response) return access.response;

  try {
    return NextResponse.json(await getOverviewData(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Analytics are unavailable." },
      { status: 503 },
    );
  }
}
