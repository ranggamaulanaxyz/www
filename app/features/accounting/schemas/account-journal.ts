import z from "zod";

export const nullableAccountIdSchema = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.uuid("Akun tidak valid.").nullable(),
);

export const accountJournalSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Nama jurnal tidak valid."),
  defaultDebitAccountId: nullableAccountIdSchema,
  defaultCreditAccountId: nullableAccountIdSchema,
});

export const accountJournalListSchema = z.array(accountJournalSchema);
