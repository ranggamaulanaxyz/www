import type z from "zod";
import type {
  createProductSchema,
  productListSchema,
  productSchema,
} from "../schemas/product";

export type Product = z.infer<typeof productSchema>;
export type ProductList = z.infer<typeof productListSchema>;
export type CreateProductValues = z.infer<typeof createProductSchema>;
