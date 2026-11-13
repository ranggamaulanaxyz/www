import {
  GoogleGenAI,
  type GoogleGenAIInteraction,
  type Interactions,
} from "@google/genai";
import { env } from "cloudflare:workers";
import { createAdminClient } from "~/utils/supabase.server";
import { getTelegramJobById } from "./job";

export async function addJobQueue(id: string) {
  await env.TELEGRAM_BOT_JOB_QUEUE.send({ id, type: "telegram_bot_job" });
}

function getPrayTimes(date: string) {
  console.log(date);
  return {
    date: date,
  };
}

const tools: Interactions.Tool[] = [
  {
    type: "function",
    name: "get_pray_times",
    description: "Jadwal shalat",
    parameters: {
      type: "object",
      properties: {
        date: { type: "string", description: "ISO format date." },
      },
      required: ["date"],
    },
  },
];

export async function chat({
  text,
  messageId,
  chatId,
}: {
  text: string;
  messageId: number;
  chatId: number;
}) {
  try {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

    let interaction: GoogleGenAIInteraction = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: text,
      tools,
    });

    for (let turn = 0; turn < 5; turn++) {
      const calls = (interaction.steps ?? []).filter(
        (step) => step.type === "function_call",
      );

      if (calls.length === 0) {
        break;
      }

      const results: Interactions.Step[] = calls.map((call) => ({
        type: "function_result",
        name: call.name,
        call_id: call.id,
        result: JSON.stringify(
          call.name === "get_pray_times"
            ? getPrayTimes(String(call.arguments.date ?? ""))
            : { error: `unknown tool: ${call.name}` },
        ),
      }));

      interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        previous_interaction_id: interaction.id,
        input: results,
      });
    }

    await sendMessage(
      chatId,
      messageId,
      interaction.output_text ?? "Maaf, saya belum bisa menjawab itu.",
    );
  } catch (error) {
    await sendMessage(
      chatId,
      messageId,
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
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
