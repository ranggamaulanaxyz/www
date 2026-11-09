import z from "zod";

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
  product: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .optional()
    .nullable(),
  account: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .optional()
    .nullable(),
});

export const accountMoveItemListSchema = z.array(accountMoveItemSchema);

export type AccountMoveItems = z.infer<typeof accountMoveItemListSchema>;
