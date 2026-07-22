import { prisma } from "@/lib/db";
import { enqueueMail } from "@/lib/mail-service";

const DAY = 86_400_000;
const reminderDays = new Set([7, 3, 1, 0]);

function daysUntil(date: Date, now: Date) { return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / DAY)); }

async function sendOnce(notificationKey: string, recipient: string, kind: string, subject: string, html: string, text: string) {
  try { await prisma.notificationLog.create({ data: { notificationKey, recipient, kind } }); } catch { return false; }
  try { await enqueueMail({ to: recipient, subject, html, text }); return true; } catch { await prisma.notificationLog.delete({ where: { notificationKey } }).catch(() => undefined); return false; }
}

export async function runOperationalNotifications() {
  const now = new Date();
  const deadline = new Date(now.getTime() + 7 * DAY);
  const [enrollments, certificates] = await Promise.all([
    prisma.enrollment.findMany({ where: { dueDate: { gte: now, lte: deadline }, status: { notIn: ["completed", "cancelled", "expired"] } }, include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } } }),
    prisma.certificate.findMany({ where: { expiresAt: { gte: now, lte: deadline }, revokedAt: null }, include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } } })
  ]);
  let sent = 0;
  for (const enrollment of enrollments) {
    const days = daysUntil(enrollment.dueDate!, now); if (!reminderDays.has(days)) continue;
    const when = days === 0 ? "hoje" : `em ${days} dia${days === 1 ? "" : "s"}`;
    sent += Number(await sendOnce(`course-due:${enrollment.id}:${days}`, enrollment.user.email, "course_due", `Prazo do curso: ${enrollment.course.title}`, `<p>Olá, ${enrollment.user.name}.</p><p>O prazo para concluir <strong>${enrollment.course.title}</strong> vence ${when}.</p><p>Acesse a SACF Academy para continuar seu curso.</p>`, `Olá, ${enrollment.user.name}. O prazo para concluir ${enrollment.course.title} vence ${when}. Acesse a SACF Academy para continuar.`));
  }
  for (const certificate of certificates) {
    const days = daysUntil(certificate.expiresAt!, now); if (!reminderDays.has(days)) continue;
    const when = days === 0 ? "hoje" : `em ${days} dia${days === 1 ? "" : "s"}`;
    sent += Number(await sendOnce(`certificate-expiry:${certificate.id}:${days}`, certificate.user.email, "certificate_expiry", `Seu certificado vence ${when}`, `<p>Olá, ${certificate.user.name}.</p><p>O certificado do curso <strong>${certificate.course.title}</strong> vence ${when}.</p><p>Entre na SACF Academy para verificar a necessidade de reciclagem.</p>`, `Olá, ${certificate.user.name}. O certificado de ${certificate.course.title} vence ${when}. Entre na SACF Academy para verificar a reciclagem.`));
  }
  return { sent, dueCandidates: enrollments.length, certificateCandidates: certificates.length };
}
