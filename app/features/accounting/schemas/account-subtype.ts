import z from "zod";

export const accountTypeSchema = z.enum([
  "asset",
  "liability",
  "equity",
  "income",
  "expense",
], "Tipe tidak valid.");

export const accountSubtypeSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Nama subtipe tidak valid."),
  type: accountTypeSchema,
});

export const accountSubtypeListSchema = z.array(accountSubtypeSchema);
