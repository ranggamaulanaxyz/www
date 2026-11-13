import { useSupabase } from "~/contexts/supabase";
import { postAccountMove } from "../services/account-move";

export function useAccountMove() {
  const supabase = useSupabase();

  const post = async (id: string) => {
    const result = await postAccountMove(supabase, id);
    console.log(result);
  };

  return { post };
}
