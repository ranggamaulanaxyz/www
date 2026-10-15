import type { PostgrestError } from "@supabase/supabase-js";

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  error: PostgrestError | null;
}

export function getPaginationRange(page: number = 1, pageSize: number = 84) {
  const from = (page - 1) * pageSize;

  return {
    from,
    to: from + pageSize - 1,
  };
}

export async function paginate<T>(
  query: PromiseLike<{
    data: T[] | null;
    error: PostgrestError | null;
    count: number | null;
  }>,
  options: PaginationOptions = {},
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, Math.floor(options.page ?? 1));
  const pageSize = Math.max(1, Math.floor(options.pageSize ?? 84));

  const { data, error, count } = await query;

  const total = count ?? 0;

  return {
    data: data ?? [],
    count: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    error,
  };
}
