import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createUploadUrl } from "@/lib/storage";

const maxDocumentBytes = 25 * 1024 * 1024;
const maxVideoBytes = 500 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !session.user.organizationSlug || !["sacf_admin", "org_admin", "instructor"].includes(role ?? "")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json() as { courseId?: string; name?: string; type?: string; size?: number; kind?: "document" | "video" };
  const size = body.size;
  if (!body.courseId || !body.name || !body.type || !body.kind || typeof size !== "number" || !Number.isFinite(size)) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const course = await prisma.course.findFirst({ where: { id: body.courseId, ...(role === "sacf_admin" ? {} : { organization: { slug: session.user.organizationSlug } }) }, select: { id: true, organizationId: true } });
  if (!course) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const isVideo = body.kind === "video";
  if ((isVideo && !body.type.startsWith("video/")) || (!isVideo && !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(body.type))) return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  if (size > (isVideo ? maxVideoBytes : maxDocumentBytes)) return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  const safeName = body.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
  const objectName = `organizations/${course.organizationId}/courses/${course.id}/${crypto.randomUUID()}-${safeName}`;
  const upload = await createUploadUrl(objectName, body.type);
  return NextResponse.json(upload);
}
