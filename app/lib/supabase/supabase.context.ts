import { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react-router";

export const SupabaseClientContext = createContext<SupabaseClient>();
export const SupabaseHeadersContext = createContext<Headers>();
