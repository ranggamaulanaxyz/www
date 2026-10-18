import { cn } from "cn";
import type { ReactNode } from "react";
import { useScrollDirection } from "~/hooks/use-scroll-direction";

export default function TopNavbar({children}: {children: ReactNode}) {
    const isVisible = useScrollDirection();
    return <div
        className={cn(
          "bg-background sticky top-0 z-50 transition-[top]",
          isVisible ? "top-0" : "-top-full",
        )}
      >{children}</div>
}