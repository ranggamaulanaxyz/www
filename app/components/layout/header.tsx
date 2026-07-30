import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
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
import type { User } from "~/modules/auth/types";

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const authenticated = !!user;
  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-transparent px-4 py-2">
      <div className="font-bold">
        <Link to="/" title={import.meta.env.PUBLIC_APP_NAME}>
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {!authenticated && (
          <div className="flex items-center gap-4">
            <Link
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              to="/signin"
            >
              Sign In
            </Link>
            <Link className={buttonVariants({ size: "sm" })} to="/signup">
              Sign Up
            </Link>
          </div>
        )}
        {authenticated && (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    title={user.name}
                  >
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    render={
                      <Link to="/account" title={user.name}>
                        <UserRoundCogIcon /> Account
                      </Link>
                    }
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    render={
                      <Link to="/signout">
                        <LogOutIcon /> Sign Out
                      </Link>
                    }
                  />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
