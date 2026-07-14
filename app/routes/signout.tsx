import { redirect } from "react-router";
import type { Route } from "../+types/root";
import { userSignOut } from "~/modules/auth/services";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(SupabaseClientContext);
  await userSignOut(supabase);
  return redirect("/signin");
}
