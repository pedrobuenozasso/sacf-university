import { CatalogView } from "@/components/catalog-view";
import { getCoursesForCurrentUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const courses = await getCoursesForCurrentUser();
  return <CatalogView courses={courses} />;
}
