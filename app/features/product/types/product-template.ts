import type z from "zod";
import type {
  createProductTemplateSchema,
  productTemplateListSchema,
  productTemplateSchema,
  productTemplateWithRelationsListSchema,
  productTemplateWithRelationsSchema,
} from "../schemas/product-template";

export type ProductTemplate = z.infer<typeof productTemplateSchema>;
export type ProductTemplateList = z.infer<typeof productTemplateListSchema>;
export type ProductTemplateWithRelations = z.infer<
  typeof productTemplateWithRelationsSchema
>;
export type ProductTemplateWithRelationsList = z.infer<
  typeof productTemplateWithRelationsListSchema
>;
export type CreateProductTemplateValues = z.infer<
  typeof createProductTemplateSchema
>;
