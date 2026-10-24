import type z from "zod";
import type {
  accountMoveItemFormSchema,
  accountMoveItemListSchema,
  accountMoveItemSchema,
  accountMoveItemWithRelationsListSchema,
  accountMoveItemWithRelationsSchema,
} from "../schemas/account-move-item";

export type AccountMoveItem = z.infer<typeof accountMoveItemSchema>;
export type AccountMoveItems = z.infer<typeof accountMoveItemListSchema>;
export type AccountMoveItemWithRelations = z.infer<
  typeof accountMoveItemWithRelationsSchema
>;
export type AccountMoveItemWithRelationsList = z.infer<
  typeof accountMoveItemWithRelationsListSchema
>;
export type AccountMoveItemFormValues = z.infer<
  typeof accountMoveItemFormSchema
>;
