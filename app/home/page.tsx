import { HomeView } from "@/components/home-view";
import { getCourses, getOrganizations } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, organizations] = await Promise.all([getCourses(), getOrganizations()]);
  return <HomeView courses={courses} organizations={organizations} />;
}
