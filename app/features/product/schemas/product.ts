import z from "zod";

export const productSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Nama produk tidak valid."),
  code: z.string("Kode produk tidak valid.").optional().nullable(),
  barcode: z.string("Barcode produk tidak valid.").optional().nullable(),
  costPrice: z.number().min(0, "Harga pokok minimal 0."),
  salePrice: z.number().min(0, "Harga jual minimal 0."),
  isSale: z.boolean(),
  isPurchase: z.boolean(),
  templateId: z.uuid("Template produk tidak valid.").optional().nullable(),
});

export const productListSchema = z.array(productSchema);
