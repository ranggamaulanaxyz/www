import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { supabaseMiddleware } from "./middlewares.server";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toast";
import { getEnv } from "./utils/env.server";
import { SupabaseProvider } from "./contexts/supabase";
import RouteErrorContent from "./components/route-error-content";
import DevelopmentErrorContent from "./components/development-error-content";
import UnexpectedErrorContent from "./components/unexpected-error-content";
import { Button } from "./components/ui/button";
import { ArrowLeftIcon, HomeIcon, RefreshCwIcon } from "lucide-react";

export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function meta() {
  return [{ title: "Rangga Maulana" }];
}

export async function loader() {
  return {
    env: {
      SUPABASE_URL: getEnv("SUPABASE_URL"),
      SUPABASE_PUBLISHABLE_KEY: getEnv("SUPABASE_PUBLISHABLE_KEY"),
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { env } = loaderData;
  return (
    <SupabaseProvider
      supabaseUrl={env.SUPABASE_URL}
      supabaseKey={env.SUPABASE_PUBLISHABLE_KEY}
    >
      <Outlet />
    </SupabaseProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <RouteErrorContent
          title="Halaman Tidak Tersedia"
          description="Akses ke halaman ini tidak dapat diproses. Halaman mungkin telah dihapus, diubah namanya, atau sedang tidak dapat diakses untuk sementara waktu."
        >
          <div className="flex gap-2">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
              Kembali
            </Button>
            <Button
              variant="secondary"
              nativeButton={false}
              render={
                <Link to="/" title="Halaman Utama">
                  <HomeIcon />
                  Halaman Utama
                </Link>
              }
            />
          </div>
        </RouteErrorContent>
      );
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    return <DevelopmentErrorContent error={error} />;
  }

  return <UnexpectedErrorContent><div className="flex gap-2">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
              Kembali
            </Button>
            <Button
              variant="secondary"
              nativeButton={false}
              render={
                <Link to="/" title="Halaman Utama">
                  <HomeIcon />
                  Halaman Utama
                </Link>
              }
            />
            
            <Button 
              variant="secondary" onClick={() => navigate(0)}>
              <RefreshCwIcon />
              Muat Ulang
            </Button>
          </div></UnexpectedErrorContent>;
}
