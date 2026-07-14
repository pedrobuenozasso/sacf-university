import { MyCoursesView } from "@/components/my-courses-view";
import { getCoursesForCurrentUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const courses = await getCoursesForCurrentUser();
  return <MyCoursesView courses={courses} />;
}
