import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import DeskSidebar from "../components/sidebar";
import BottomNavbar from "../components/bottom-navbar";
import { Outlet, useOutlet } from "react-router";
import { Fragment } from "react/jsx-runtime";
import Home from "../components/home";
import type { Route } from "./+types/dashboard";
import {
  authMiddleware,
  userOnlyMiddleware,
} from "~/features/auth/middlewares.server";
import { getTodayPrayerTimes } from "~/features/prayer-times/services/prayer-time";
import { supabaseClientContext } from "~/context";
import { getUserBySession } from "~/features/auth/sevices/user";
import { useEffect } from "react";
import { registerServiceWorker } from "~/utils/pwa.client";

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  userOnlyMiddleware,
];

export const links: Route.LinksFunction = () => [
  { rel: "manifest", href: "/desk.webmanifest" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const user = await getUserBySession(supabase);
  const todayPrayerTimesPromise = getTodayPrayerTimes(user?.prayerTimesCityId, {
    tz: user?.timeZone,
  });

  return { todayPrayerTimesPromise, user };
}

export default function Desk() {
  const outlet = useOutlet();
  useEffect(() => {
    registerServiceWorker();
  }, []);

  if (!outlet) {
    return <Home />;
  }

  return (
    <Fragment>
      <SidebarProvider>
        <DeskSidebar />
        <SidebarInset className="flex min-h-0 min-w-0 flex-col">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </Fragment>
  );
}
