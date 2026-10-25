import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import { useScroll } from "~/hooks/use-scroll";

/**
 * The topbar only hides while the page is actually scrolled and the user is
 * scrolling up, so it is always visible at the top of the page.
 */
export function useTopBarHidden() {
  const { scrolled, scrolledUp } = useScroll();
  return scrolled && scrolledUp;
}

export function TopBar({
  children,
  ...props
}: {
  children: ReactNode;
  /**
   * Controlled visibility. When omitted, the topbar follows the window scroll
   * position (the default behavior for page-scrolled layouts).
   */
  hidden?: boolean;
}) {
  const shouldHide = useTopBarHidden();
  const hidden = props.hidden ?? shouldHide;
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Measure the real height instead of guessing, and keep it in sync when the
  // topbar content changes (e.g. mobile filter input hidden on resize).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setHeight(el.offsetHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-hidden={hidden || undefined}
      className="sticky top-0 z-50 transition-[top] duration-200 ease-linear"
      style={{ top: hidden ? -height : 0 }}
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
