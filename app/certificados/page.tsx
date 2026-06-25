import { CertificatesView } from "@/components/certificates-view";
import { getCourses } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const courses = await getCourses();
  return <CertificatesView courses={courses} />;
}
