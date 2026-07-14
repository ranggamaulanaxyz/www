import { userActivation } from "~/modules/auth/services";
import type { Route } from "./+types/signup-activation";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { data } from "react-router";

export async function loader({ url, context }: Route.LoaderArgs) {
  const token = url.searchParams.get("token");
  if (!token) {
    throw data({ message: "Token is required" }, { status: 404 });
  }
  const supabase = context.get(SupabaseClientContext);
  const { success } = await userActivation(supabase, token);
}

export default function SignupActivation() {
  return <></>;
}
