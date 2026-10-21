import type z from "zod";
import type {
  accountMoveItemListSchema,
  accountMoveItemSchema,
  accountMoveListSchema,
  accountMoveSchema,
  accountMoveStatusSchema,
} from "../schemas/account-move";

export type AccountMoveStatus = z.infer<typeof accountMoveStatusSchema>;
export type AccountMoveItem = z.infer<typeof accountMoveItemSchema>;
export type AccountMoveItems = z.infer<typeof accountMoveItemListSchema>;
export type AccountMove = z.infer<typeof accountMoveSchema>;
export type AccountMoves = z.infer<typeof accountMoveListSchema>;
