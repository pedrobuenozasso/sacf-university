import { HomeView } from "@/components/home-view";
import { getCoursesForCurrentUser, getOrganizations } from "@/lib/data";
import { auth } from "@/lib/auth";
import { appPath } from "@/lib/app-path";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (["sacf_admin", "org_admin", "instructor"].includes(session?.user?.role ?? "")) {
    redirect(appPath("/admin"));
  }
  const [courses, organizations] = await Promise.all([getCoursesForCurrentUser(), getOrganizations()]);
  return <HomeView courses={courses} organizations={organizations} />;
}
