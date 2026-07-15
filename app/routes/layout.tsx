import { Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { AuthContext, authMiddleware } from "~/modules/auth/middleware";
import { Header } from "~/components/layout/header";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];

export async function clientLoader({ context }: Route.ClientActionArgs) {
  const auth = context.get(AuthContext);
  const user = auth?.user ?? null;
  return { user };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  return (
    <div>
      <Header user={user} />
      <Outlet />
    </div>
  );
}
