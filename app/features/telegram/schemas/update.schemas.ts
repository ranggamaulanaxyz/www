import z from "zod";

const telegramUserSchema = z.object({
  id: z.number(),
  isBot: z.boolean(),
  firstName: z.string(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  languageCode: z.string().optional(),
});

const telegramChatSchema = z.object({
  id: z.number(),
  type: z.enum(["private", "group", "supergroups", "channel"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
});

const telegramMessageSchema = z.object({
  messageId: z.number(),
  from: telegramUserSchema.optional(),
  chat: telegramChatSchema,
  // Telegram sends `date` as Unix seconds.
  date: z
    .number()
    .int()
    .nonnegative()
    .transform((date) => new Date(date * 1000).toISOString()),
  text: z.string().optional(),
});

export const telegramUpdateSchema = z.object({
  updateId: z.number(),
  message: telegramMessageSchema.optional(),
});

export type TelegramUpdate = z.infer<typeof telegramUpdateSchema>;

export const telegramBotJobSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }).nullable(),
  updateId: z.number(),
  updateData: telegramUpdateSchema,
  status: z.enum(["pending", "processing", "completed", "failed"]),
});

export type TelegramBotJob = z.infer<typeof telegramBotJobSchema>;
