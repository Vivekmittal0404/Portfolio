import { NextResponse } from "next/server";
import { authorizeAdminApi, readJsonBody } from "@/lib/admin-api";
import { clearAdminSession } from "@/lib/auth";
import { connectDatabase } from "@/lib/db";
import { Admin } from "@/lib/models";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { allowRateLimit } from "@/lib/security";
import { passwordUpdateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const access = await authorizeAdminApi(request, true);
  if (access.response) return access.response;
  const parsed = passwordUpdateSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Use a new password with at least 12 characters." },
      { status: 400 },
    );
  }

  try {
    const allowed = await allowRateLimit(
      request,
      "password-change",
      5,
      15 * 60 * 1000,
      access.admin.id,
    );
    if (!allowed) {
      return NextResponse.json(
        { message: "Too many attempts. Try again later." },
        { status: 429 },
      );
    }
    await connectDatabase();
    const admin = await Admin.findById(access.admin.id).select("+passwordHash");
    if (
      !admin ||
      !(await verifyPassword(parsed.data.currentPassword, admin.passwordHash))
    ) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 403 },
      );
    }

    admin.passwordHash = await hashPassword(parsed.data.newPassword);
    admin.authVersion += 1;
    await admin.save();
    await clearAdminSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to update password." },
      { status: 503 },
    );
  }
}
