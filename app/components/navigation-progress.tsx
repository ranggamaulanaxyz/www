import { useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";
import { cn } from "cn";

const TICK_MS = 200;
const COMPLETE_MS = 280;

type ProgressState = {
  visible: boolean;
  value: number;
};

export function NavigationProgress() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  const [progress, setProgress] = useState<ProgressState>({
    visible: false,
    value: 0,
  });
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    clearTimers();

    if (isNavigating) {
      setProgress({ visible: true, value: 8 });

      const tick = () => {
        setProgress((prev) => {
          if (!prev.visible || prev.value >= 90) return prev;

          return {
            visible: true,
            value: prev.value + (90 - prev.value) * 0.1,
          };
        });

        timers.current.push(setTimeout(tick, TICK_MS));
      };

      timers.current.push(setTimeout(tick, TICK_MS));
    } else {
      setProgress((prev) =>
        prev.visible ? { visible: true, value: 100 } : prev,
      );

      timers.current.push(
        setTimeout(() => {
          setProgress({ visible: false, value: 0 });
        }, COMPLETE_MS),
      );
    }

    return clearTimers;
  }, [isNavigating]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 transition-opacity duration-200",
        progress.visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className="bg-primary h-full transition-[width] duration-200 ease-out"
        style={{ width: `${progress.value}%` }}
      />
    </div>
  );
}
