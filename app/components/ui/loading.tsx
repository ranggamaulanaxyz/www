import { Loader } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "~/lib/utils";

interface LoadingProps {
  className?: string;
  loaded?: boolean;
  children?: ReactNode;
}

export default function Loading({
  className,
  loaded = false,
  children,
}: LoadingProps) {
  const [showSpinner, setShowSpinner] = useState(!loaded);
  const [spinnerOpacity, setSpinnerOpacity] = useState(loaded ? 0 : 1);
  const [showChildren, setShowChildren] = useState(loaded);
  const [childrenOpacity, setChildrenOpacity] = useState(loaded ? 1 : 0);

  useEffect(() => {
    if (loaded) {
      setSpinnerOpacity(0);
      setShowChildren(true);

      const childrenTimer = setTimeout(() => {
        setChildrenOpacity(1);
      }, 50);

      const spinnerTimer = setTimeout(() => {
        setShowSpinner(false);
      }, 300);

      return () => {
        clearTimeout(childrenTimer);
        clearTimeout(spinnerTimer);
      };
    } else {
      setShowSpinner(true);
      setSpinnerOpacity(1);
      setShowChildren(false);
      setChildrenOpacity(0);
    }
  }, [loaded]);

  if (!children) {
    return (
      <div
        className={cn("flex min-h-dvh items-center justify-center", className)}
      >
        <Loader className="text-muted-foreground animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh w-full">
      {showSpinner && (
        <div
          style={{ opacity: spinnerOpacity }}
          className={cn(
            "bg-background pointer-events-none absolute inset-0 z-50 flex min-h-dvh items-center justify-center transition-opacity duration-300 ease-in-out",
            className,
          )}
        >
          <Loader className="text-muted-foreground animate-spin" size={24} />
        </div>
      )}
      {showChildren && (
        <div
          style={{ opacity: childrenOpacity }}
          className="transition-opacity duration-300 ease-in-out"
        >
          {children}
        </div>
      )}
    </div>
  );
}
