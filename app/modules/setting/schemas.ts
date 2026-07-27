import z from "zod";

export const SettingSchema = z.object({
  id: z.string().optional(),
  key: z.string().nonempty("Key is required"),
  value: z.string().nonempty("Value is required"),
  createdAt: z.string().optional().readonly(),
  updatedAt: z.string().optional().readonly(),
});

export type SettingSchema = z.infer<typeof SettingSchema>;
