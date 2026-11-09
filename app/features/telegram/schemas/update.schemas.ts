import z from "zod";

const userSchema = z.object({
  id: z.number(),
  isBot: z.boolean(),
  firstName: z.string(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  languageCode: z.string().optional(),
});

const chatSchema = z.object({
  id: z.number(),
  type: z.enum(["private", "group", "supergroups", "channel"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
});

const messageSchema = z.object({
  messageId: z.number(),
  from: userSchema.optional(),
  chat: chatSchema,
  date: z.number(),
  text: z.string().optional(),
});

export const updateSchema = z.object({
  updateId: z.number(),
  message: messageSchema.optional(),
});
