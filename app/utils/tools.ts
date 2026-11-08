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

export function parseDateValue(input?: string): Date | undefined {
  if (!input) {
    return;
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
  const localMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(input);

  let year: number;
  let month: number;
  let day: number;

  if (isoMatch) {
    year = Number(isoMatch[1]);
    month = Number(isoMatch[2]);
    day = Number(isoMatch[3]);
  } else if (localMatch) {
    day = Number(localMatch[1]);
    month = Number(localMatch[2]);
    year = Number(localMatch[3]);
  } else {
    return;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return;
  }

  return date;
}

export function formatDate(date?: Date) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateISO(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T> | null)?.then === "function";
}
