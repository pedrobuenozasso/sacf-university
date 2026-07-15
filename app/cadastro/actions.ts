"use server";

import { sendImplementationRequest } from "@/lib/send-implementation-request";

export type ImplementationRequestInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  employees: string;
  message?: string;
};

export type ImplementationRequestResult = { ok: true } | { ok: false; error: string };

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

const employeeRanges = new Set(["1-25", "26-100", "101-500", "501-1000", "1000+"]);

export async function requestImplementation(
  input: ImplementationRequestInput
): Promise<ImplementationRequestResult> {
  const request = {
    name: clean(input.name),
    email: input.email.trim().toLowerCase(),
    phone: clean(input.phone),
    company: clean(input.company),
    employees: clean(input.employees),
    message: input.message?.trim() ?? ""
  };

  if (!request.name || !request.company || !request.phone || !request.employees) {
    return { ok: false, error: "Preencha os campos obrigatórios." };
  }

  if (!request.email.includes("@") || request.email.length > 254) {
    return { ok: false, error: "Informe um email corporativo válido." };
  }

  if (
    request.name.length > 120 ||
    request.company.length > 160 ||
    request.phone.length > 40 ||
    request.message.length > 2_000 ||
    !employeeRanges.has(request.employees)
  ) {
    return { ok: false, error: "Revise os dados informados e tente novamente." };
  }

  try {
    await sendImplementationRequest(request);
  } catch {
    return { ok: false, error: "Não foi possível enviar sua solicitação agora. Tente novamente mais tarde." };
  }

  return { ok: true };
}
