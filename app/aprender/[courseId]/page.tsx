import { redirect } from "next/navigation";
import { LearningPlayer } from "@/components/learning-player";
import { getLearningCourse } from "@/lib/learning";

export const dynamic = "force-dynamic";

export default async function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await getLearningCourse(courseId);
  if (!course) redirect(`/catalogo/${courseId}`);
  return <LearningPlayer course={course} />;
}
