import { useEffect, useRef } from "react";

type TurnstileOptions = {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  language?: string;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }

      reject(new Error("Turnstile gagal dimuat."));
    };
    script.onerror = () => reject(new Error("Turnstile gagal dimuat."));
    document.head.appendChild(script);
  }).catch((error) => {
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
}

type TurnstileWidgetProps = {
  sitekey: string;
  action: string;
  /**
   * Token Turnstile sekali pakai. Setiap kali nilai ini berubah (misalnya
   * setelah submit berhasil atau gagal), widget di-reset agar token baru
   * dibuat untuk percobaan berikutnya.
   */
  resetKey?: unknown;
  className?: string;
};

export default function TurnstileWidget({
  sitekey,
  action,
  resetKey,
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const isFirstResetRef = useRef(true);

  useEffect(() => {
    let disposed = false;

    loadTurnstile()
      .then((turnstile) => {
        if (disposed || !containerRef.current) {
          return;
        }

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey,
          action,
          theme: "auto",
          language: "id",
        });
      })
      .catch(() => {
        // Server tetap menolak submit tanpa token yang valid.
      });

    return () => {
      disposed = true;

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
    };
  }, [sitekey, action]);

  useEffect(() => {
    if (isFirstResetRef.current) {
      isFirstResetRef.current = false;
      return;
    }

    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetKey]);

  return <div ref={containerRef} className={className} />;
}
