import type z from "zod";
import type {
  productBrandListSchema,
  productBrandSchema,
} from "../schemas/product-brand";

export type ProductBrand = z.infer<typeof productBrandSchema>;
export type ProductBrandList = z.infer<typeof productBrandListSchema>;
