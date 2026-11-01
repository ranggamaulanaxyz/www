import { parseWithZod } from "@conform-to/zod/v4";
import type { ZodType } from "zod";

export function parseForm<T extends ZodType>(
  formData: FormData,
  options: { schema: T },
) {
  return parseWithZod(formData, options);
}
