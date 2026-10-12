import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Admin } from "@/lib/models";
import { connectDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/passwords";

const COOKIE_NAME = "portfolio_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must contain at least 32 characters.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function authenticateAdmin(email: string, password: string) {
  await connectDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  let admin = await Admin.findOne({ email: normalizedEmail }).select(
    "+passwordHash",
  );

  if (!admin && (await Admin.countDocuments()) === 0) {
    const bootstrapEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const bootstrapHash = process.env.ADMIN_PASSWORD_HASH;

    if (
      bootstrapEmail === normalizedEmail &&
      bootstrapHash &&
      (await verifyPassword(password, bootstrapHash))
    ) {
      try {
        admin = await Admin.create({
          email: normalizedEmail,
          displayName:
            process.env.ADMIN_DISPLAY_NAME?.trim() ||
            normalizedEmail.split("@")[0],
          passwordHash: bootstrapHash,
        });
      } catch (error) {
        if (
          !(
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === 11000
          )
        ) {
          throw error;
        }
        admin = await Admin.findOne({ email: normalizedEmail }).select(
          "+passwordHash",
        );
      }
    }
  }

  if (
    !admin ||
    !admin.isActive ||
    !(await verifyPassword(password, admin.passwordHash))
  ) {
    return null;
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  return {
    id: String(admin._id),
    email: admin.email,
    displayName: admin.displayName,
    authVersion: admin.authVersion,
  };
}

export async function createAdminSession(adminId: string, authVersion: number) {
  const token = await new SignJWT({ role: "admin", authVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(signingKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, signingKey(), {
      algorithms: ["HS256"],
    });

    if (
      payload.role !== "admin" ||
      typeof payload.sub !== "string" ||
      typeof payload.authVersion !== "number"
    ) {
      return null;
    }
    return { adminId: payload.sub, authVersion: payload.authVersion };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const session = await getAdminSession();
  if (!session) return null;

  try {
    await connectDatabase();
    const admin = await Admin.findOne({ _id: session.adminId, isActive: true })
      .select("email displayName lastLoginAt authVersion")
      .lean();

    if (!admin || admin.authVersion !== session.authVersion) return null;
    return {
      id: String(admin._id),
      email: admin.email,
      displayName: admin.displayName,
      lastLoginAt: admin.lastLoginAt?.toISOString() ?? null,
    };
  } catch {
    return null;
  }
}
