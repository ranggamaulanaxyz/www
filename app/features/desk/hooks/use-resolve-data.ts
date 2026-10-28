import { useEffect, useState } from "react";
import { isPromiseLike } from "~/utils/tools";

export function useResolveData<T>(data: T | Promise<T>) {
  const [resolvedData, setResolvedData] = useState<T>();
  const [state, setState] = useState<"loading" | "loaded">(
    isPromiseLike(data) ? "loading" : "loading",
  );
  useEffect(() => {
    let active = true;

    Promise.resolve(data)
      .then((result) => {
        if (active) setResolvedData(result);
      })
      .finally(() => {
        if (active) setState("loaded");
      });

    return () => {
      active = false;
    };
  }, [data]);

  return { data: resolvedData as T, state };
}
