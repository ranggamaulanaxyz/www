import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export type PaginationData = { from: number; to: number; count: number };

export function usePagination(data: PaginationData | Promise<PaginationData>) {
  const [searchParams] = useSearchParams();
  const from = parseInt(searchParams.get("from") || "0");
  const to = parseInt(searchParams.get("to") || "0");
  const [state, setState] = useState({
    from,
    to,
    count: 0,
  });

  useEffect(() => {
    const resolveData = async () => {
      const { from, to, count } = await data;
      setState({ from, to, count });
    };
    resolveData();
  }, [searchParams]);

  return [state, setState] as const;
}
