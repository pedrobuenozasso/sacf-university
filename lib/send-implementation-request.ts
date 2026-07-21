import type { ImplementationRequestInput } from "@/app/cadastro/actions";
import { enqueueMail } from "@/lib/mail-service";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendImplementationRequest(request: ImplementationRequestInput) {
  const to = process.env.IMPLEMENTATION_INBOX_EMAIL || "contato@sacf.io";
  const safe = {
    name: escapeHtml(request.name),
    email: escapeHtml(request.email),
    phone: escapeHtml(request.phone),
    company: escapeHtml(request.company),
    employees: escapeHtml(request.employees),
    message: escapeHtml(request.message || "Sem mensagem adicional.").replace(/\n/g, "<br />")
  };

  await enqueueMail({
    to,
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
    `,
    text: `Nova solicitação de implantação\n\nNome: ${request.name}\nEmail: ${request.email}\nTelefone: ${request.phone}\nEmpresa: ${request.company}\nFuncionários: ${request.employees}\nMensagem: ${request.message || "Sem mensagem adicional."}`
  });
}
