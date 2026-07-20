import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { AuthContext, authMiddleware } from "~/modules/auth/middleware";
import { Logo } from "~/components/brand/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LogOutIcon, UserRoundCogIcon } from "lucide-react";

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
    <div className="bg-background min-h-screen">
      <header className="text-foreground fixed top-0 z-50 flex w-full items-center justify-between bg-transparent px-6 py-4 backdrop-blur-xs transition-all duration-300">
        <div className="font-bold">
          <Link
            to="/"
            title={import.meta.env.PUBLIC_APP_NAME}
            className="transition-opacity hover:opacity-80"
          >
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!authenticated && (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="px-4">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button size="sm" className="px-5" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          {authenticated && (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    title={user.name}
                  >
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/account" title={user.name}>
                        <UserRoundCogIcon className="mr-2 h-4 w-4" /> Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" asChild>
                      <Link to="/signout">
                        <LogOutIcon className="mr-2 h-4 w-4" /> Sign Out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>
      <main></main>
    </div>
  );
}
