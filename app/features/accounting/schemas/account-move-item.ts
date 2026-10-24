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
});

export const accountMoveItemListSchema = z.array(accountMoveItemSchema);

export const accountMoveItemWithRelationsSchema = accountMoveItemSchema.extend({
  move: z
    .object({
      number: z.string().optional().nullable(),
      date: z.string(),
    })
    .optional()
    .nullable(),
  account: z
    .object({
      code: z.string(),
      name: z.string(),
    })
    .optional()
    .nullable(),
  partner: z
    .object({
      name: z.string(),
    })
    .optional()
    .nullable(),
});

export const accountMoveItemWithRelationsListSchema = z.array(
  accountMoveItemWithRelationsSchema,
);

export const nullableAccountMoveItemProductIdSchema = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.uuid("Produk tidak valid.").nullable(),
);

export const accountMoveItemFormSchema = z.object({
  name: z
    .string("Deskripsi item jurnal tidak valid.")
    .min(1, "Deskripsi item jurnal wajib diisi."),
  moveId: z.uuid("Jurnal umum tidak valid."),
  accountId: z.uuid("Akun tidak valid."),
  partnerId: z.uuid("Kontak tidak valid."),
  productId: nullableAccountMoveItemProductIdSchema,
  debit: z.coerce
    .number("Debit tidak valid.")
    .min(0, "Debit minimal 0.")
    .default(0),
  credit: z.coerce
    .number("Kredit tidak valid.")
    .min(0, "Kredit minimal 0.")
    .default(0),
});
