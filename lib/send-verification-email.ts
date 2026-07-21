import { enqueueMail } from "@/lib/mail-service";

export async function sendVerificationEmail(email: string, url: string) {
  await enqueueMail({
    to: email,
    subject: "Confirme seu acesso à SACF Academy",
    html: `
      <p>Clique no link abaixo para confirmar seu email e criar sua senha:</p>
      <p><a href="${url}">${url}</a></p>
      <p>Este link expira em 30 minutos. Se você não solicitou isso, ignore este email.</p>
    `,
    text: `Confirme seu acesso à SACF Academy: ${url}\n\nEste link expira em 30 minutos.`
  });
}
