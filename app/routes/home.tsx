import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { AuthContext, authMiddleware } from "~/modules/auth/middleware";
import { Logo } from "~/components/brand/logo";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: import.meta.env.PUBLIC_APP_NAME },
    { name: "description", content: "Welcome to my personal website!" },
  ];
}

export async function clientLoader({ context }: Route.ClientActionArgs) {
  const auth = context.get(AuthContext);
  const user = auth?.user ?? null;
  return { user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const authenticated = !!user;
  return (
    <div>
      <header className="flex items-center justify-between bg-white px-4 py-2">
        <div className="font-bold">
          <Link to="/" title={import.meta.env.PUBLIC_APP_NAME}>
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!authenticated && (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          {authenticated && (
            <div className="flex items-center gap-4">
              <p>{user.email}</p>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/signout">Sign Out</Link>
              </Button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
