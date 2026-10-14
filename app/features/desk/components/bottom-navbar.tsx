import { cn } from "cn";
import {
  BellIcon,
  BotIcon,
  CogIcon,
  CommandIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

function isActive(pathname: string) {
  const location = useLocation();
  return pathname === location.pathname;
}

function MenuLink({
  children,
  to,
  title,
}: {
  children: ReactNode;
  to: string;
  title?: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "inline-block rounded-full p-2 transition-all",
          "hover:bg-secondary hover:text-secondary-foreground hover:-mt-2",
          "data-active:bg-primary data-active:text-primary-foreground",
          "data-active:hover:bg-primary data-active:hover:text-primary-foreground data-active:hover:opacity-70",
        )}
        title={title}
        data-active={isActive(to)}
      >
        {children}
      </Link>
    </li>
  );
}

export default function BottomNavbar() {
  return (
    <div className="bg-background fixed bottom-0 w-full rounded-t-2xl border-t p-2 md:hidden">
      <ul className="flex items-center justify-between">
        <MenuLink to="/desk/assistant" title="Assistant">
          <BotIcon className="h-6" />
        </MenuLink>
        <MenuLink to="#" title="Pencarian">
          <SearchIcon className="h-6" />
        </MenuLink>
        <li className="-mt-10 transition-all hover:-mt-12">
          <Link
            to="/desk"
            className="bg-primary text-primary-foreground inline-block rounded-full p-4 shadow-lg"
          >
            <HomeIcon />
          </Link>
        </li>
        <MenuLink to="/desk/notification">
          <BellIcon className="h-6" />
        </MenuLink>
        <MenuLink to="/desk/me">
          <UserIcon className="h-6" />
        </MenuLink>
      </ul>
    </div>
  );
}
