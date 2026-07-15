export async function sendVerificationEmail(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[auth] Development verification link for ${email}: ${url}`);
      return;
    }
    throw new Error("Email delivery is not configured.");
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "SACF Academy <onboarding@resend.dev>",
    to: email,
    subject: "Confirme seu acesso à SACF Academy",
    html: `
      <p>Clique no link abaixo para confirmar seu email e criar sua senha:</p>
      <p><a href="${url}">${url}</a></p>
      <p>Este link expira em 30 minutos. Se você não solicitou isso, ignore este email.</p>
    `
  });
}
