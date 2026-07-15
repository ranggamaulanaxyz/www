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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./components/ui/empty";
import { Copy, FolderX, OctagonX } from "lucide-react";
import { toast } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";

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
  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let status = 500;
  let message =
    "An unexpected error occurred. Please contact the administrator.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  if (import.meta.env.DEV && status !== 404) {
    const formatStackTrace = (stackStr?: string) => {
      if (!stackStr) return null;
      return stackStr.split("\n").map((line, i) => {
        const atIndex = line.indexOf("at ");
        if (atIndex !== -1) {
          const beforeAt = line.substring(0, atIndex + 3);
          const afterAt = line.substring(atIndex + 3);
          const openParen = afterAt.indexOf("(");
          const closeParen = afterAt.lastIndexOf(")");

          if (openParen !== -1 && closeParen !== -1) {
            const functionName = afterAt.substring(0, openParen);
            const pathInfo = afterAt.substring(openParen + 1, closeParen);
            return (
              <div key={i} className="text-muted-foreground">
                {beforeAt}
                <span className="text-foreground">{functionName}</span>(
                <span
                  className="text-primary cursor-pointer font-medium hover:underline"
                  onClick={() => {
                    navigator.clipboard.writeText(stack || message);
                    toast.success("Path copied to clipboard");
                  }}
                >
                  {pathInfo}
                </span>
                )
              </div>
            );
          } else {
            return (
              <div key={i} className="text-muted-foreground">
                {beforeAt}
                <span className="text-primary cursor-pointer font-medium hover:underline">
                  {afterAt}
                </span>
              </div>
            );
          }
        }
        return <div key={i}>{line}</div>;
      });
    };

    return (
      <main>
        <div className="p-4">
          <Card className="pb-0">
            <CardHeader>
              <CardTitle>{status}</CardTitle>
              <CardDescription>Message: {message}</CardDescription>
              <CardAction>
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(stack || message);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy /> Copy error
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted/50 m-0 -mx-(--card-spacing) overflow-y-scroll border-t px-(--card-spacing) py-4 text-sm leading-relaxed">
                {formatStackTrace(stack)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {status === 404 ? <FolderX /> : <OctagonX />}
          </EmptyMedia>
          <EmptyTitle>{status ? status : "Something went wrong!"}</EmptyTitle>
          <EmptyDescription>{message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          {status === 404 ? (
            <Button variant="outline" onClick={() => window.history.back()}>
              Go back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload
            </Button>
          )}
        </EmptyContent>
      </Empty>
    </main>
  );
}
