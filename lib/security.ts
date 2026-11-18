import "server-only";

import { createHmac } from "node:crypto";
import { connectDatabase } from "@/lib/db";
import { RateLimit } from "@/lib/models";

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  try {
    const originHost = new URL(origin).host;
    const reqHost = host ?? new URL(request.url).host;
    if (originHost === reqHost) return true;
    if (
      (originHost.startsWith("localhost") || originHost.startsWith("127.0.0.1")) &&
      (reqHost.startsWith("localhost") || reqHost.startsWith("127.0.0.1"))
    ) {
      return true;
    }
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return true;
  }
}

export async function allowRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
  identity = "",
) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) return false;

  const remoteAddress =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const key = createHmac("sha256", secret)
    .update(`${scope}:${remoteAddress}:${identity}`)
    .digest("hex");
  const window = Math.floor(Date.now() / windowMs);

  await connectDatabase();
  let bucket;
  try {
    bucket = await RateLimit.findOneAndUpdate(
      { key, window },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((window + 2) * windowMs) },
      },
      { new: true, upsert: true },
    );
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
    bucket = await RateLimit.findOneAndUpdate(
      { key, window },
      { $inc: { count: 1 } },
      { new: true },
    );
  }

  return Boolean(bucket && bucket.count <= limit);
}
