import { GoogleGenAI } from "@google/genai";
import { env } from "cloudflare:workers";

export async function addJobQueue(jobId: string) {
  await env.TELEGRAM_BOT_JOB_QUEUE.send({ jobId });
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
