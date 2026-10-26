import { useSearchParams } from "react-router";
import { useIsMobile } from "~/hooks/use-mobile";
import type { DeskListView } from "../types/view";

export function useView(enableGridView: boolean) {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedView = searchParams.get("view");

  let view: DeskListView = "table";
  if (
    enableGridView &&
    (requestedView === "grid" || (requestedView !== "table" && isMobile))
  ) {
    view = "grid";
  }

  const setView = (nextView: DeskListView) => {
    if (!enableGridView) return;
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("view", nextView);
    setSearchParams(nextSearchParams, { replace: true });
  };

  return { view, setView, gridViewEnabled: enableGridView };
}
