import type z from "zod";
import type {
  accountSubtypeListSchema,
  accountSubtypeSchema,
  accountTypeSchema,
} from "../schemas/account-subtype";

export type AccountType = z.infer<typeof accountTypeSchema>;
export type AccountSubtypeSchema = z.infer<typeof accountSubtypeSchema>;
export type AccountSubtypeListSchema = z.infer<typeof accountSubtypeListSchema>;
