import "server-only";

import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";

export async function authorizeAdminApi(request: Request, mutation = false) {
  if (mutation && !isSameOrigin(request)) {
    return {
      admin: null,
      response: NextResponse.json(
        { message: "Request rejected." },
        { status: 403 },
      ),
    };
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      admin: null,
      response: NextResponse.json(
        { message: "Authentication required." },
        { status: 401 },
      ),
    };
  }

  return { admin, response: null };
}

export async function readJsonBody(
  request: Request,
  maxBytes = 32_000,
): Promise<unknown | null> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxBytes) return null;

  const reader = request.body?.getReader();
  if (!reader) return null;

  const decoder = new TextDecoder();
  let text = "";
  let byteLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteLength += value.byteLength;
    if (byteLength > maxBytes) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
