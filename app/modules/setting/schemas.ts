import z from "zod";

const checkbox = z.preprocess(
  (value) => (value === true ? value : value === "on"),
  z.boolean(),
);

export const SettingSchema = z.object({
  id: z.string().optional(),
  key: z.string().nonempty("Key is required"),
  value: z.string().nonempty("Value is required"),
  isPublic: checkbox.default(false),
  createdAt: z.string().optional().readonly(),
  updatedAt: z.string().optional().readonly(),
});

export type SettingSchema = z.infer<typeof SettingSchema>;
