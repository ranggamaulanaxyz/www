import { cn } from "cn";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import { useScroll } from "~/hooks/use-scroll";

export function TopBar({ children }: { children: ReactNode }) {
  const { scrolledUp } = useScroll();
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(45);

  useEffect(() => {
    if (ref.current?.clientHeight) {
      setTop(ref.current?.clientHeight);
    } else {
      setTop(45);
    }
  }, [ref.current?.clientHeight]);

  return (
    <div
      ref={ref}
      className={cn("sticky z-50 transition-[top]")}
      style={{ top: scrolledUp ? `-${top}px` : 0 }}
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
