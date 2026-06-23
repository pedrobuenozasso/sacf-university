import { CatalogView } from "@/components/catalog-view";
import { courses } from "@/lib/courses";

export default function CatalogPage() {
  return <CatalogView courses={courses} />;
}
