import type { ReactNode } from "react";

export default function WebsiteWrapper({ children }: { children: ReactNode }) {
  return <div className="flex min-h-dvh flex-col">{children}</div>;
}
