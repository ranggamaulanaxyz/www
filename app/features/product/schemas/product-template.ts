import z from "zod";

function parseNumber(value: unknown) {
  return value || 0;
}

function parseOptionalUuid(value: unknown) {
  return value === "" || value === undefined || value === null ? null : value;
}

const optionalUuid = (message: string) =>
  z.preprocess(parseOptionalUuid, z.uuid(message).nullable());

export const productTemplateSchema = z.object({
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
  categoryId: optionalUuid("Kategori produk tidak valid."),
  brandId: optionalUuid("Merek produk tidak valid."),
  defaultIncomeAccountId: optionalUuid("Akun pendapatan produk tidak valid."),
  defaultExpenseAccountId: optionalUuid("Akun beban produk tidak valid."),
});

export const productTemplateListSchema = z.array(productTemplateSchema);

const relatedNameSchema = z.object({ name: z.string() }).optional().nullable();

export const productTemplateWithRelationsSchema = productTemplateSchema.extend({
  category: relatedNameSchema,
  brand: relatedNameSchema,
  defaultIncomeAccount: relatedNameSchema,
  defaultExpenseAccount: relatedNameSchema,
});

export const productTemplateWithRelationsListSchema = z.array(
  productTemplateWithRelationsSchema,
);

export const createProductTemplateSchema = productTemplateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductTemplateSchema = createProductTemplateSchema;
