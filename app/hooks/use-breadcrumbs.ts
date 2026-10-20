import { useMatches, type UIMatch } from "react-router";
import type { Breadcrumb, Handle, Match } from "~/features/desk/types/route";

function hasBreadcrumb(
  match: UIMatch<unknown, unknown>,
): match is Match<unknown> & {
  handle: Required<Pick<Handle<unknown>, "breadcrumb">>;
} {
  const handle = match.handle;

  if (
    typeof handle !== "object" ||
    handle === null ||
    !("breadcrumb" in handle)
  ) {
    return false;
  }

  return (
    typeof handle.breadcrumb === "object" ||
    typeof handle.breadcrumb === "function"
  );
}

export function useBreadcrumbs(): Breadcrumb[] {
  const matches = useMatches();

  const breadcrumbMatches = matches.filter(hasBreadcrumb);

  return breadcrumbMatches.map((match, index) => {
    const breadcrumb =
      typeof match.handle.breadcrumb === "function"
        ? match.handle.breadcrumb(match)
        : match.handle.breadcrumb;

    return {
      to: breadcrumb.to ?? match.pathname,
      label: breadcrumb.label,
      current:
        breadcrumb !== undefined
          ? index === breadcrumbMatches.length - 1
          : false,
    };
  });
}
