import type { Route } from "./+types/ai";
import { OpenRouter } from "@openrouter/sdk";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const message = formData.get("message") as string;

  const client = new OpenRouter({
    apiKey: import.meta.env.OPENROUTER_API_KEY,
  });

  const stream = await client.chat.send({
    chatRequest: {
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      stream: true,
    },
  });

  if (!(stream instanceof ReadableStream)) {
    throw new Error("Expected a streaming response");
  }

  const encoder = new TextEncoder();

  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content;

          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
