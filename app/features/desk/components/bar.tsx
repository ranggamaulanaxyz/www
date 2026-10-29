import { cn } from "cn";
import { type ReactNode } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import DeskHeader from "./header";

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

export function DeskTopBar({ children }: { children?: ReactNode }) {
  return (
    <TopBar>
      <DeskHeader>{children}</DeskHeader>
    </TopBar>
  );
}

export function DeskBottomBar({
  className,
  children,
  ...props
}: { children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <BottomBar>
      <div
        className={cn(
          "bg-background grid grid-cols-5 rounded-2xl border-t p-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </BottomBar>
  );
}

export function DeskBottomBarItem({
  className,
  children,
  ...props
}: { children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}
