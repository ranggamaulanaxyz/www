import type z from "zod";
import type { partnerListSchema, partnerSchema } from "../schemas/partner";

export type Partner = z.infer<typeof partnerSchema>;
export type Partners = z.infer<typeof partnerListSchema>;
