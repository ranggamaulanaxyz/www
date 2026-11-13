import z from "zod";
import {
  accountMoveItemListSchema,
  accountMoveItemSchema,
} from "./account-move-item";
import { accountJournalSchema } from "./account-journal";
import { partnerSchema } from "~/features/partner/schemas/partner";

export {
  accountMoveItemListSchema,
  accountMoveItemSchema,
} from "./account-move-item";

export const accountMoveStatusSchema = z.enum(["draft", "posted"], {
  message: "Status jurnal tidak valid.",
});

export type AccountMoveStatus = z.infer<typeof accountMoveStatusSchema>;

export const accountMoveSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  number: z.string().nullable().optional(),
  date: z.string("Tanggal jurnal tidak valid."),
  journalId: z.uuid("Buku jurnal tidak valid."),
  journal: accountJournalSchema,
  partnerId: z.uuid("Kontak tidak valid."),
  partner: partnerSchema,
  status: accountMoveStatusSchema.default("draft"),
  items: z.array(accountMoveItemSchema).optional(),
});

export type AccountMove = z.infer<typeof accountMoveSchema>;

export const accountMoveListSchema = z.array(accountMoveSchema);

export type AccountMoves = z.infer<typeof accountMoveListSchema>;

export const accountMoveFormSchema = z.object({
  number: z.string("Nomor tidak valid.").optional().nullable(),
  date: z.iso.date("Tanggal tidak valid."),
  journalId: z.string("Jurnal tidak valid."),
  partnerId: z.string("Kontak tidak valid.").nullable(),
  items: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        productId: z.string("Produk tidak valid.").nullable().optional(),
        name: z.string("Deskripsi tidak valid."),
        accountId: z.string("Akun tidak valid."),
        debit: z.coerce
          .number("Debit tidak valid.")
          .nonnegative("Debit harus sama atau lebih besar dari 0.")
          .default(0),
        credit: z.coerce
          .number("Kredit tidak valid.")
          .nonnegative("Kredit harus sama atau lebih besar dari 0.")
          .default(0),
      }),
    )
    .min(1, "Mohon tambahkan baris jurnal."),
});

export type AccountMoveFormData = z.infer<typeof accountMoveFormSchema>;
