import type { ImplementationRequestInput } from "@/app/cadastro/actions";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendImplementationRequest(request: ImplementationRequestInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.IMPLEMENTATION_INBOX_EMAIL ?? "contato@sacf.io";
  const safe = {
    name: escapeHtml(request.name),
    email: escapeHtml(request.email),
    phone: escapeHtml(request.phone),
    company: escapeHtml(request.company),
    employees: escapeHtml(request.employees),
    message: escapeHtml(request.message || "Sem mensagem adicional.").replace(/\n/g, "<br />")
  };

  if (!apiKey) {
    console.log("[implementation-request]", JSON.stringify({ to, ...request }, null, 2));
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "SACF Academy <onboarding@resend.dev>",
    to,
    replyTo: request.email,
    subject: `Nova solicitação de implantação: ${request.company}`,
    html: `
      <h2>Nova solicitação de implantação</h2>
      <p><strong>Nome:</strong> ${safe.name}</p>
      <p><strong>Email:</strong> ${safe.email}</p>
      <p><strong>Telefone:</strong> ${safe.phone}</p>
      <p><strong>Empresa:</strong> ${safe.company}</p>
      <p><strong>Funcionários:</strong> ${safe.employees}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${safe.message}</p>
    `
  });
}
