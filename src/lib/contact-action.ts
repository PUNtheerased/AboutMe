"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(4).max(4000),
});

export type ContactState = {
  ok: boolean;
  error?: string;
};

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  // Without RESEND_API_KEY we still accept the form so the UX works locally.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "hello@example.com";

  if (!apiKey) {
    console.info("[contact]", parsed.data);
    return { ok: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [to],
      replyTo: parsed.data.email,
      subject: `Portfolio message from ${parsed.data.name}`,
      text: parsed.data.message,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "send" };
  }
}
