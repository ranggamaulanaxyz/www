import z from "zod";

function parseNumber(value: unknown) {
  return value || 0;
}

const number = z.preprocess((value) => value || 0, z.number());

export const productSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Nama produk tidak valid."),
  code: z.string("Kode produk tidak valid.").optional().nullable(),
  barcode: z.string("Barcode produk tidak valid.").optional().nullable(),
  costPrice: z.preprocess(
    parseNumber,
    z.number("Harga beli produk tidak valid."),
  ),
  salePrice: z.preprocess(
    parseNumber,
    z.number("Harga jual produk tidak valid."),
  ),
  isSale: z.boolean().default(false).optional(),
  isPurchase: z.boolean().default(false).optional(),
  templateId: z.uuid("Template produk tidak valid.").optional().nullable(),
});

export const productListSchema = z.array(productSchema);

export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  templateId: true,
});

export const updateProductSchema = createProductSchema;
