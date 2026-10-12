import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { authorizeAdminApi, readJsonBody } from "@/lib/admin-api";
import { connectDatabase } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { messageUpdateSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const access = await authorizeAdminApi(request, true);
  if (access.response) return access.response;
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { message: "Message not found." },
      { status: 404 },
    );
  }

  const parsed = messageUpdateSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid message update." },
      { status: 400 },
    );
  }

  try {
    await connectDatabase();
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { $set: { readAt: parsed.data.isRead ? new Date() : null } },
      { new: true },
    ).select("_id readAt");
    if (!message) {
      return NextResponse.json(
        { message: "Message not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({
      id: String(message._id),
      isRead: Boolean(message.readAt),
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to update message." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const access = await authorizeAdminApi(request, true);
  if (access.response) return access.response;
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { message: "Message not found." },
      { status: 404 },
    );
  }

  try {
    await connectDatabase();
    const message = await ContactMessage.findByIdAndDelete(id).select("_id");
    if (!message) {
      return NextResponse.json(
        { message: "Message not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to delete message." },
      { status: 503 },
    );
  }
}
