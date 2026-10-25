import { cn } from "cn";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import { useScroll } from "~/hooks/use-scroll";

export function TopBar({
  children,
  hidden,
}: {
  children: ReactNode;
  hidden: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => setHeight(element.offsetHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-hidden={!hidden}
      className={cn(
        "sticky top-0 z-50 transition-transform duration-200 ease-linear",
        hidden ? "-translate-y-full" : "translate-y-0",
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
