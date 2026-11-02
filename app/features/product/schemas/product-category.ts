import z from "zod";

export const productCategorySchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Nama kategori tidak valid."),
  parentId: z.uuid("Kategori induk tidak valid.").optional().nullable(),
});

export const productCategoryListSchema = z.array(productCategorySchema);

export const createProductCategorySchema = z.object({
  name: z.string("Nama kategori tidak valid."),
  parentId: z.uuid("Kategori tidak valid.").optional(),
});
