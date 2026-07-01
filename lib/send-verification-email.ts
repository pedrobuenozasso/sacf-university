export async function sendVerificationEmail(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev fallback: no Resend key configured yet — log the link so the flow is
    // testable end-to-end without sending a real email.
    console.log(`[auth] Link de verificação para ${email}: ${url}`);
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "SACF University <onboarding@resend.dev>",
    to: email,
    subject: "Confirme seu acesso à SACF University",
    html: `
      <p>Clique no link abaixo para confirmar seu email e criar sua senha:</p>
      <p><a href="${url}">${url}</a></p>
      <p>Este link expira em 30 minutos. Se você não solicitou isso, ignore este email.</p>
    `
  });
}
