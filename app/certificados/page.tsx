import { CertificatesView } from "@/components/certificates-view";
import { getMyCertificates } from "@/lib/certificates";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const certificates = await getMyCertificates();
  return <CertificatesView certificates={certificates} />;
}
