import { useEffect, useMemo, useRef } from "react";

type DebouncedCallback<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  /** Cancel a pending call. */
  cancel: () => void;
};

/**
 * Returns a stable function that invokes `callback` only after `delay`
 * milliseconds have passed since the last call.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 300,
): DebouncedCallback<TArgs> {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Always call the latest callback without restarting the debounce timer.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Drop any pending call when the component unmounts.
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return useMemo(() => {
    const debounced = (...args: TArgs) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    };

    debounced.cancel = () => clearTimeout(timeoutRef.current);

    return debounced;
  }, [delay]);
}
