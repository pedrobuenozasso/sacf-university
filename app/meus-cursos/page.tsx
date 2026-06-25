import { MyCoursesView } from "@/components/my-courses-view";
import { getCourses } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const courses = await getCourses();
  return <MyCoursesView courses={courses} />;
}
