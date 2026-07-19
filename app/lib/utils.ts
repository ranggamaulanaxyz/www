import z from "zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ValidationError, ValidationErrorDetail } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatError<T>(error: z.ZodError): ValidationError<T> {
  const formattedErrors = error.issues.reduce<
    Record<string, ValidationErrorDetail[]>
  >((prev, current) => {
    const key =
      current.path.length > 0 ? String(current.path[0]) : "unrecognizedKey";
    if (!prev[key]) {
      prev[key] = [];
    }
    prev[key].push({
      message: current.message,
    });

    return prev;
  }, {});
  return formattedErrors as ValidationError<T>;
}

export async function validate<S extends z.ZodRawShape>(
  schema: z.ZodObject<S>,
  data: unknown,
): Promise<
  | { success: true; data: z.infer<typeof schema> }
  | { success: false; errors: ValidationError<z.infer<typeof schema>> }
> {
  const result = await schema.safeParseAsync(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const error = formatError<z.infer<typeof schema>>(result.error);
  return { success: false, errors: error };
}

export function getEmailClientUrl(email?: string): string {
  if (!email) return "https://mail.google.com";
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return "https://mail.google.com";

  switch (domain) {
    case "gmail.com":
      return "https://mail.google.com";
    case "yahoo.com":
    case "ymail.com":
      return "https://mail.yahoo.com";
    case "outlook.com":
    case "hotmail.com":
    case "live.com":
    case "msn.com":
      return "https://outlook.live.com";
    case "proton.me":
    case "protonmail.com":
      return "https://mail.proton.me";
    case "icloud.com":
      return "https://www.icloud.com/mail";
    case "zoho.com":
      return "https://mail.zoho.com";
    default:
      return `https://${domain}`;
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
