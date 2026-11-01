import type { ShouldRevalidateFunctionArgs } from "react-router";

const DEFAULT_IGNORED_PARAMS = ["view"];

/**
 * Create a `shouldRevalidate` function that skips revalidation when only
 * the ignored query params changed (e.g. view mode toggle).
 *
 * @param ignoredParams - Query param names to ignore when comparing URLs
 * @returns A `shouldRevalidate` function usable as a route export
 */
export function createShouldRevalidate(
  ignoredParams: string[] = DEFAULT_IGNORED_PARAMS,
) {
  return function shouldRevalidate({
    currentUrl,
    nextUrl,
    defaultShouldRevalidate,
  }: ShouldRevalidateFunctionArgs) {
    if (currentUrl.pathname === nextUrl.pathname) {
      const currentParams = new URLSearchParams(currentUrl.search);
      const nextParams = new URLSearchParams(nextUrl.search);
      for (const param of ignoredParams) {
        currentParams.delete(param);
        nextParams.delete(param);
      }
      if (currentParams.toString() === nextParams.toString()) return false;
    }
    return defaultShouldRevalidate;
  };
}
