import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { authMiddleware } from "~/modules/auth/middleware.server";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware]

export function meta({}: Route.MetaArgs) {
  return [
    { title: import.meta.env.APP_NAME },
    { name: "description", content: "Welcome to my personal website!" },
  ];
}

export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-between bg-white px-4 py-2">
        <div className="font-bold">
          <Link to="/" title={import.meta.env.APP_NAME}><span className="bg-primary text-primary-foreground p-1 inline-block rounded">RM</span><span className="rounded inline-block">XYZ</span></Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">Sign In</Button>
          <Button size="sm" asChild>
            <Link to="/signup">
              Sign Up
            </Link>
          </Button>
        </div>
      </header>
    </div>
  );
}
