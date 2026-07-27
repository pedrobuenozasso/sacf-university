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

export async function sendPasswordResetEmail(email: string, url: string) {
  await enqueueMail({
    to: email,
    subject: "Redefina sua senha da SACF Academy",
    html: `
      <p>Recebemos uma solicitação para redefinir sua senha.</p>
      <p><a href="${url}">Redefinir minha senha</a></p>
      <p>Se você não solicitou esta alteração, ignore este email. O link expira em 30 minutos.</p>
    `,
    text: `Redefina sua senha da SACF Academy: ${url}\n\nSe você não solicitou esta alteração, ignore este email. O link expira em 30 minutos.`
  });
}

export async function sendAdminLoginCodeEmail(email: string, code: string) {
  await enqueueMail({
    to: email,
    subject: "Código de acesso administrativo — SACF Academy",
    html: `
      <p>Use este código para concluir seu acesso administrativo à SACF Academy:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p>
      <p>Ele expira em 10 minutos e só pode ser usado uma vez. Se você não iniciou este acesso, altere sua senha e avise a equipe SACF.</p>
    `,
    text: `Seu código de acesso administrativo SACF Academy é: ${code}\n\nEle expira em 10 minutos e só pode ser usado uma vez.`
  });
}
