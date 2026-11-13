import z from "zod";

export const nullableAccountIdSchema = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.uuid("Akun tidak valid.").nullable(),
);

export const accountJournalPrefixSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z
    .string("Prefix tidak valid.")
    .regex(
      /^[A-Za-z0-9]{1,10}$/,
      "Prefix hanya boleh huruf dan angka, maksimal 10 karakter.",
    )
    .nullable(),
);

export const accountJournalSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Nama jurnal tidak valid."),
  prefix: z.string().nullable().optional(),
  defaultDebitAccountId: nullableAccountIdSchema,
  defaultCreditAccountId: nullableAccountIdSchema,
});

export const accountJournalListSchema = z.array(accountJournalSchema);
