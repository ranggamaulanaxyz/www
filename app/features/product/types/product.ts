import type z from "zod";
import type { productListSchema, productSchema } from "../schemas/product";

export type Product = z.infer<typeof productSchema>
export type ProductList = z.infer<typeof productListSchema>