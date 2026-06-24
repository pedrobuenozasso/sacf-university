import { CatalogView } from "@/components/catalog-view";
import { getCourses } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const courses = await getCourses();
  return <CatalogView courses={courses} />;
}
