import { AuthContext } from "~/modules/auth/middleware";
import type { Route } from "./+types/home";

export async function clientLoader({ context }: Route.ClientActionArgs) {
  const auth = context.get(AuthContext);
  const user = auth?.user ?? null;
  return { user };
}

export default function AccountHome() {
  return <></>;
}
