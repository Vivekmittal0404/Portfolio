import { NextResponse } from "next/server";
import { authorizeAdminApi, readJsonBody } from "@/lib/admin-api";
import { connectDatabase } from "@/lib/db";
import { Admin } from "@/lib/models";
import { profileUpdateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const access = await authorizeAdminApi(request);
  if (access.response) return access.response;
  return NextResponse.json(access.admin, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request: Request) {
  const access = await authorizeAdminApi(request, true);
  if (access.response) return access.response;
  const parsed = profileUpdateSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Enter a valid display name." },
      { status: 400 },
    );
  }

  try {
    await connectDatabase();
    await Admin.findByIdAndUpdate(access.admin.id, {
      $set: { displayName: parsed.data.displayName },
    });
    return NextResponse.json({ displayName: parsed.data.displayName });
  } catch {
    return NextResponse.json(
      { message: "Unable to update profile." },
      { status: 503 },
    );
  }
}
