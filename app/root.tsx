import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Toaster } from "./components/ui/sonner";
import { supabaseMiddleware } from "./lib/supabase/middleware.server";
import { supabaseClientMiddleware } from "./lib/supabase/middleware.client";
import { Logo } from "./components/brand/logo";
import { Card, CardHeader } from "./components/ui/card";

export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  supabaseClientMiddleware,
];

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

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Rangga Maulana" },
    {
      name: "description",
      content: "Welcome to my website.",
    },
  ];
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
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let status;
  let message = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status ? error.status.toString() : null;
    message =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex h-svh items-center justify-center">
      <div className="mx-auto max-w-sm grow">
        <div className="flex items-center justify-center">
          <div className="flex aspect-square animate-pulse items-center justify-center rounded-full bg-red-300 p-2 text-5xl font-black text-red-500">
            <span className="animate-none">{status ? status : "X"}</span>
          </div>
        </div>
      </div>
    </main>
  );

  // return (
  //   <main className="container mx-auto p-4 pt-16">
  //     <h1>{message}</h1>
  //     <p>{details}</p>
  //     {stack && (
  //       <pre className="w-full overflow-x-auto p-4">
  //         <code>{stack}</code>
  //       </pre>
  //     )}
  //   </main>
  // );
}
