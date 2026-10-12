import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authorizeAdminApi, readJsonBody } from "@/lib/admin-api";
import { connectDatabase } from "@/lib/db";
import { Project } from "@/lib/models";
import { allowRateLimit } from "@/lib/security";
import { projectSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const access = await authorizeAdminApi(request, true);
  if (access.response) return access.response;
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { message: "Project not found." },
      { status: 404 },
    );
  }

  const parsed = projectSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Check the project fields and try again." },
      { status: 400 },
    );
  }

  try {
    const allowed = await allowRateLimit(
      request,
      "project-write",
      60,
      60_000,
      access.admin.id,
    );
    if (!allowed) {
      return NextResponse.json(
        { message: "Too many changes. Try again shortly." },
        { status: 429 },
      );
    }
    await connectDatabase();
    const project = await Project.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    }).select("_id");
    if (!project) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 },
      );
    }
    revalidatePath("/");
    return NextResponse.json({ id: String(project._id) });
  } catch {
    return NextResponse.json(
      { message: "Unable to update project." },
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
      { message: "Project not found." },
      { status: 404 },
    );
  }

  try {
    const allowed = await allowRateLimit(
      request,
      "project-write",
      60,
      60_000,
      access.admin.id,
    );
    if (!allowed) {
      return NextResponse.json(
        { message: "Too many changes. Try again shortly." },
        { status: 429 },
      );
    }
    await connectDatabase();
    const project = await Project.findByIdAndDelete(id).select("_id");
    if (!project) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 },
      );
    }
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to delete project." },
      { status: 503 },
    );
  }
}
