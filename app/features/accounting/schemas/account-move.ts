import z from "zod";

export const accountMoveStatusSchema = z.enum(["draft", "posted"], {
  message: "Status jurnal tidak valid.",
});

export const accountMoveItemSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Deskripsi item jurnal tidak valid."),
  productId: z.uuid().optional().nullable(),
  partnerId: z.uuid("Kontak item jurnal tidak valid."),
  accountId: z.uuid("Akun tidak valid."),
  debit: z.number().min(0, "Debit minimal 0.").default(0),
  credit: z.number().min(0, "Kredit minimal 0.").default(0),
  moveId: z.uuid().optional().nullable(),
});

export const accountMoveItemListSchema = z.array(accountMoveItemSchema);

export const accountMoveSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  date: z.string("Tanggal jurnal tidak valid."),
  journalId: z.uuid("Buku jurnal tidak valid."),
  partnerId: z.uuid("Kontak tidak valid."),
  status: accountMoveStatusSchema.default("draft"),
  items: z.array(accountMoveItemSchema).optional(),
});

export const accountMoveListSchema = z.array(accountMoveSchema);

export const nullableAccountMoveNumberSchema = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.string("Nomor jurnal tidak valid.").nullable(),
);

export const accountMoveFormSchema = z.object({
  number: nullableAccountMoveNumberSchema,
  date: z
    .string("Tanggal jurnal tidak valid.")
    .min(1, "Tanggal jurnal wajib diisi."),
  journalId: z.uuid("Buku jurnal tidak valid."),
  partnerId: z.uuid("Kontak tidak valid."),
  status: accountMoveStatusSchema.default("draft"),
});

export type AccountMoveStatus = z.infer<typeof accountMoveStatusSchema>;
export type AccountMoveItem = z.infer<typeof accountMoveItemSchema>;
export type AccountMoveItems = z.infer<typeof accountMoveItemListSchema>;
export type AccountMove = z.infer<typeof accountMoveSchema>;
export type AccountMoves = z.infer<typeof accountMoveListSchema>;
export type AccountMoveFormValues = z.infer<typeof accountMoveFormSchema>;
