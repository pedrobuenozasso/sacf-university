type MailMessage = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
};

/** Keeps SMTP credentials confined to SACF's internal mail service. */
export async function enqueueMail(message: MailMessage) {
  const baseUrl = process.env.MAIL_SERVICE_URL?.replace(/\/$/, "");
  const token = process.env.MAIL_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[mail-service] Development email", message);
      return;
    }
    throw new Error("Internal email service is not configured.");
  }

  const response = await fetch(`${baseUrl}/v1/send`, {
    method: "POST",
    cache: "no-store",
    headers: { "content-type": "application/json", "x-service-token": token },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(10_000)
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Internal email service failed (${response.status}): ${body.slice(0, 300)}`);
  }
}
