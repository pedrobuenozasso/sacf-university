import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createDownloadUrl, isStoragePath } from "@/lib/storage";

export async function GET(request: Request) {
  const session = await auth();
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const organizationId = session?.user?.organizationId;

  // URLs cannot be reused to access another company's private storage area.
  const canAccessAllOrganizations = session?.user?.role === "sacf_admin";
  if (!organizationId || !isStoragePath(path) || (!canAccessAllOrganizations && !path.includes(`/organizations/${organizationId}/`))) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.redirect(await createDownloadUrl(path));
}
