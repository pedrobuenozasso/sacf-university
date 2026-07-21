import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createUploadUrl } from "@/lib/storage";

const maxDocumentBytes = 25 * 1024 * 1024;
const maxVideoBytes = 500 * 1024 * 1024;
const maxImageBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !session.user.organizationSlug || !["sacf_admin", "org_admin", "instructor"].includes(role ?? "")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json() as { courseId?: string; name?: string; type?: string; size?: number; kind?: "document" | "video" | "image"; target?: "course" | "organization_logo" };
  const size = body.size;
  if (!body.name || !body.type || !body.kind || typeof size !== "number" || !Number.isFinite(size) || size <= 0 || body.name.length > 255 || body.type.length > 120) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const isVideo = body.kind === "video";
  const isImage = body.kind === "image";
  const documentTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  const imageTypes = ["image/jpeg", "image/png", "image/webp"];
  if ((isVideo && !body.type.startsWith("video/")) || (isImage && !imageTypes.includes(body.type)) || (!isVideo && !isImage && !documentTypes.includes(body.type))) return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  if (size > (isVideo ? maxVideoBytes : isImage ? maxImageBytes : maxDocumentBytes)) return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  const safeName = body.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "upload";
  let objectName: string;
  if (body.target === "organization_logo") {
    if (!isImage || !session.user.organizationId) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    objectName = `organizations/${session.user.organizationId}/branding/${crypto.randomUUID()}-${safeName}`;
  } else {
    if (!body.courseId) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    const course = await prisma.course.findFirst({ where: { id: body.courseId, ...(role === "sacf_admin" ? {} : { organization: { slug: session.user.organizationSlug } }) }, select: { id: true, organizationId: true } });
    if (!course) return NextResponse.json({ error: "not_found" }, { status: 404 });
    objectName = `organizations/${course.organizationId}/courses/${course.id}/${crypto.randomUUID()}-${safeName}`;
  }
  const upload = await createUploadUrl(objectName, body.type);
  return NextResponse.json(upload);
}
