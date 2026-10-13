import { supabaseClientContext } from "~/context";
import type { Route } from "./+types/signout";
import { redirect } from "react-router";

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }

  return redirect("/signin");
}
