import * as React from "react";

export function useIsMounted() {
  const [isMounted, setIsMounted] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return !!isMounted;
}
