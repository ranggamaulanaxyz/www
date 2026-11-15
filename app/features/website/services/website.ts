import type { Resend } from "resend";
import { email } from "zod";

export async function sendContactEmail(
  resend: Resend,
  payload: { name: string; email: string; subject: string; message: string },
) {
  const { data, error } = await resend.emails.send({
    from: "Zet <zet@ranggamaulana.xyz>",
    to: "Rangga <me@ranggamaulana.xyz>",
    replyTo: `${payload.name} <${payload.email}>`,
    subject: payload.subject,
    text: payload.message,
  });

  if (error) {
    throw error;
  }

  return data;
}
