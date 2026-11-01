import type z from "zod";
import type {
  productCategoryListSchema,
  productCategorySchema,
} from "../schemas/product-category";

export type ProductCategory = z.infer<typeof productCategorySchema>;
export type ProductCategoryList = z.infer<typeof productCategoryListSchema>;
