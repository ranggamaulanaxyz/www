import { GoogleGenAI } from "@google/genai";
import { env } from "cloudflare:workers";
import { createAdminClient } from "~/utils/supabase.server";
import { getTelegramJobById } from "./job";

export async function addJobQueue(id: string) {
  await env.TELEGRAM_BOT_JOB_QUEUE.send({ id, type: "telegram_bot_job" });
}

export async function chat({
  text,
  messageId,
  chatId,
}: {
  text: string;
  messageId: number;
  chatId: number;
}) {
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    input: text,
  });
  if (interaction.output_text) {
    sendMessage(chatId, messageId, interaction.output_text);
  }
  console.log(interaction.output_text);
  return;
}

async function sendMessage(
  chatId: number,
  messageId: number | undefined,
  text: string,
) {
  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_API_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...(messageId && {
          reply_parameters: {
            message_id: messageId,
          },
        }),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }

  return response.json();
}

export async function runTelegramJob(id: string) {
  const supabase = createAdminClient();
  const job = await getTelegramJobById(supabase, id);

  if (!job.updateData.message || !job.updateData.message?.text) {
    return;
  }

  await chat({
    text: job.updateData.message?.text,
    messageId: job.updateData.message?.messageId,
    chatId: job.updateData.message?.chat.id,
  });
}
