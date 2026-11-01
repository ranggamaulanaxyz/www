import z from "zod";

export const productBrandSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Nama merek tidak valid."),
});

export const productBrandListSchema = z.array(productBrandSchema);

export const createProductBrandSchema = z.object({
  name: z.string("Nama merek tidak valid."),
});
