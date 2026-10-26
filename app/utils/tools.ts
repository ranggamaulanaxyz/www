export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get initials from a name.
 * @param name - Full name (e.g. "John Ronald Reuel Tolkien")
 * @param maxChars - Maximum number of initials to return (default: 2)
 * @returns Uppercase initials (e.g. "JR" for maxChars = 2)
 */
export function getInitials(name: string, maxChars: number = 2): string {
  if (!name || maxChars <= 0) return "";

  const words = name.trim().split(/\s+/).filter(Boolean);

  // Use the first character of each word (supports Unicode/emoji safely)
  const initials = words.map((word) => Array.from(word)[0]);

  return initials.slice(0, Math.floor(maxChars)).join("").toUpperCase();
}

export function formatCurrency(
  value: number | bigint,
  currency: string = "IDR",
  locales: Intl.LocalesArgument = "id-ID",
) {
  const formater = new Intl.NumberFormat(locales, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  });

  return formater.format(value);
}

export function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T> | null)?.then === "function";
}
