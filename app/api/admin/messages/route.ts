import { NextResponse } from "next/server";
import { authorizeAdminApi } from "@/lib/admin-api";
import { getMessageRows } from "@/lib/admin-data";

export async function GET(request: Request) {
  const access = await authorizeAdminApi(request);
  if (access.response) return access.response;

  const search = new URL(request.url).searchParams.get("search") ?? "";
  try {
    return NextResponse.json(await getMessageRows(search), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Messages are unavailable." },
      { status: 503 },
    );
  }
}
