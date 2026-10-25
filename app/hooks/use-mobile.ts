import * as React from "react";
import { useRouteLoaderData } from "react-router";
import { isMobileUserAgent } from "~/utils/ua";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const data = useRouteLoaderData("root");
  const defaultIsMobile = isMobileUserAgent(data?.userAgent);
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    defaultIsMobile,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
