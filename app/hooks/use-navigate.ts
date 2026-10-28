import { useCallback, useSyncExternalStore } from "react";
import {
  useLocation,
  useNavigate as useReactRouterNavigate,
} from "react-router";

function subscribeNavigation(callback: () => void) {
  if (typeof window === "undefined" || !("navigation" in window)) {
    return () => {};
  }

  const navigation = window.navigation;

  navigation.addEventListener("currententrychange", callback);
  navigation.addEventListener("navigatesuccess", callback);

  return () => {
    navigation.removeEventListener("currententrychange", callback);
    navigation.removeEventListener("navigatesuccess", callback);
  };
}

// Gunakan string primitif sebagai snapshot yang stabil.
function getNavigationSnapshot() {
  if (typeof window === "undefined" || !("navigation" in window)) {
    return "0:0";
  }

  const navigation = window.navigation;
  const entries = navigation.entries();
  const index = entries.findIndex(
    (entry) => entry.key === navigation.currentEntry?.key,
  );

  const canGoBack = index > 0;
  const canGoNext = index >= 0 && index < entries.length - 1;

  return `${Number(canGoBack)}:${Number(canGoNext)}`;
}

function getServerSnapshot() {
  return "0:0";
}

export function useNavigate(options?: { homeUrl?: string }) {
  const navigate = useReactRouterNavigate();
  const location = useLocation();

  const snapshot = useSyncExternalStore(
    subscribeNavigation,
    getNavigationSnapshot,
    getServerSnapshot,
  );

  const [back, next] = snapshot.split(":");
  const canGoBack = back === "1";
  const canGoNext = next === "1";

  const navigateBack = useCallback(() => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(options?.homeUrl ?? "/");
    }
  }, [canGoBack, navigate, options?.homeUrl]);

  const navigateNext = useCallback(() => {
    if (canGoNext) {
      navigate(1);
    }
  }, [canGoNext, navigate]);

  return {
    navigate,
    navigateBack,
    navigateNext,
    canGoBack,
    canGoNext,
  };
}
