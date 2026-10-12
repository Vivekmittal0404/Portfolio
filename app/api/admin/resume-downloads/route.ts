import { NextResponse } from "next/server";
import { authorizeAdminApi } from "@/lib/admin-api";
import { getResumeDownloadData } from "@/lib/admin-data";

export async function GET(request: Request) {
  const access = await authorizeAdminApi(request);
  if (access.response) return access.response;

  try {
    return NextResponse.json(await getResumeDownloadData(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Download data is unavailable." },
      { status: 503 },
    );
  }
}
