import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authorizeAdminApi, readJsonBody } from "@/lib/admin-api";
import { getProjectRows } from "@/lib/admin-data";
import { connectDatabase } from "@/lib/db";
import { Project } from "@/lib/models";
import { allowRateLimit } from "@/lib/security";
import { projectSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const access = await authorizeAdminApi(request);
  if (access.response) return access.response;

  try {
    return NextResponse.json(await getProjectRows(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Projects are unavailable." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const access = await authorizeAdminApi(request, true);
  if (access.response) return access.response;

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
    const project = await Project.create(parsed.data);
    revalidatePath("/");
    return NextResponse.json({ id: String(project._id) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Unable to save project." },
      { status: 503 },
    );
  }
}
