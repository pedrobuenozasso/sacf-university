import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isScopedStoragePath, verifyUploadedObject } from "@/lib/storage";

type UploadKind = "document" | "video" | "image";
type UploadTarget = "course" | "organization_logo" | "profile_avatar";

export async function POST(request: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !session.user.organizationId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json() as { courseId?: string; kind?: UploadKind; target?: UploadTarget; storagePath?: string };
  if (!body.storagePath || !body.kind || !body.target || !["document", "video", "image"].includes(body.kind)) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  let authorized = false;
  if (body.target === "profile_avatar") {
    authorized = body.kind === "image" && isScopedStoragePath(body.storagePath, session.user.organizationId, "avatar", undefined, session.user.id);
  } else if (body.target === "organization_logo") {
    authorized = body.kind === "image" && ["sacf_admin", "org_admin"].includes(role ?? "") && isScopedStoragePath(body.storagePath, session.user.organizationId, "branding");
  } else if (body.courseId && ["sacf_admin", "org_admin", "instructor"].includes(role ?? "")) {
    const course = await prisma.course.findFirst({ where: { id: body.courseId, ...(role === "sacf_admin" ? {} : { organizationId: session.user.organizationId }) }, select: { id: true, organizationId: true } });
    authorized = Boolean(course && isScopedStoragePath(body.storagePath, course.organizationId, "course", course.id));
  }
  if (!authorized) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    const verified = await verifyUploadedObject(body.storagePath, body.kind);
    return verified ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "invalid_file" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }
}
