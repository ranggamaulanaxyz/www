import { useCallback } from "react";
import {
  useLocation,
  useNavigate as useReactRouterNavigate,
} from "react-router";

export function useNavigate(options?: { homeUrl?: string }) {
  const navigate = useReactRouterNavigate();
  const location = useLocation();

  const isBackHome = location.state?.fromApp !== true;

  // React Router tidak menyediakan API untuk memeriksa
  // browser forward history secara langsung.
  // Nilai ini merupakan fallback berdasarkan state navigasi.
  const isLastPage = location.state?.hasNext !== true;

  const navigateBack = useCallback(() => {
    if (location.state?.fromApp) {
      navigate(-1);
    } else {
      navigate(options?.homeUrl || "/");
    }
  }, [location.state, navigate]);

  const navigateNext = useCallback(() => {
    if (!isLastPage) {
      navigate(1);
    }
  }, [isLastPage, navigate]);

  return {
    navigate,
    navigateBack,
    navigateNext,
    isBackHome,
    isLastPage,
  };
}
