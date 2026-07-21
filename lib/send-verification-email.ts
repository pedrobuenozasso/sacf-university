export async function sendVerificationEmail(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "SACF Academy <no-reply@sacf.io>";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[auth] Development verification link for ${email}: ${url}`);
      return;
    }
    throw new Error("Email delivery is not configured.");
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Confirme seu acesso à SACF Academy",
    html: `
      <p>Clique no link abaixo para confirmar seu email e criar sua senha:</p>
      <p><a href="${url}">${url}</a></p>
      <p>Este link expira em 30 minutos. Se você não solicitou isso, ignore este email.</p>
    `
  });

  if (error) throw new Error(`Email delivery failed: ${error.message}`);
}
