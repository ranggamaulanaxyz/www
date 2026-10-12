import type { ReactNode } from "react";

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <div className="mx-auto max-w-md flex-1 grow">{children}</div>
    </main>
  );
}
