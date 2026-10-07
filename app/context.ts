import { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react-router";

export const supabaseClientContext = createContext<SupabaseClient>();
