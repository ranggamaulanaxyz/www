import { Bot } from "grammy";
import type { Update } from "grammy/types";
import { getEnv } from "~/utils/env.server";

export class ZetTelegramService {
  private token;
  private bot;
  constructor() {
    this.token = getEnv("ZET_TELEGRAM_API_TOKEN");
    this.bot = new Bot(this.token);
  }

  async setup() {
    await this.bot.api.setWebhook(
      "https://ranggamaulana.xyz/zet/webhook/telegram",
    );
    const webhookInfo = await this.bot.api.getWebhookInfo();

    return {
      webhookUrl: webhookInfo.url,
    };
  }

  async serve(req: Request) {
    // const update = (await req.json()) as Update;
    // try {
    //   console.log("Telegram update:", JSON.stringify(update));
    //   await this.bot.init();
    //   await this.bot.handleUpdate(update);
    //   console.log("Telegram update handled successfully");
    // } catch (error) {
    //   console.error("GRAMMY ERROR:", error);
    //   if (error instanceof Error) {
    //     console.error("name:", error.name);
    //     console.error("message:", error.message);
    //     console.error("stack:", error.stack);
    //   }
    //   throw error;
    // }
  }
}
