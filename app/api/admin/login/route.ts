import { NextResponse } from "next/server";
import { z } from "zod";
import { readJsonBody } from "@/lib/admin-api";
import { authenticateAdmin, createAdminSession } from "@/lib/auth";
import { DatabaseUnavailableError, isDatabaseConfigured } from "@/lib/db";
import { allowRateLimit, isSameOrigin } from "@/lib/security";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  }

  if (!isDatabaseConfigured() || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      {
        message: "Admin setup is incomplete. Configure the server environment.",
      },
      { status: 503 },
    );
  }

  const body = await readJsonBody(request, 4_000);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Enter a valid email and password." },
      { status: 400 },
    );
  }

  try {
    const [ipAllowed, emailAllowed] = await Promise.all([
      allowRateLimit(request, "admin-login-ip", 50, 15 * 60 * 1000),
      allowRateLimit(
        request,
        "admin-login-email",
        50,
        15 * 60 * 1000,
        parsed.data.email.toLowerCase(),
      ),
    ]);
    if (!ipAllowed || !emailAllowed) {
      return NextResponse.json(
        { message: "Too many attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    }

    const admin = await authenticateAdmin(
      parsed.data.email,
      parsed.data.password,
    );
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    await createAdminSession(admin.id, admin.authVersion);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json(
        {
          message:
            "MongoDB is unreachable. Add this server’s IP to the Atlas Network Access list, then retry.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { message: "Admin login is temporarily unavailable." },
      { status: 503 },
    );
  }
}
