import { cn } from "cn";
import { type ReactNode } from "react";
import { useIsMobile } from "~/hooks/use-mobile";

export function TopBar({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "sticky top-0 z-50 transition-transform duration-200 ease-linear",
      )}
    >
      {children}
    </div>
  );
}

export function BottomBar({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return null;
  }
  return <div className="fixed bottom-0 w-full">{children}</div>;
}
