import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react-router";
import type { Resend } from "resend";

export const supabaseClientContext = createContext<SupabaseClient>();
export const supabaseAdminClientContext = createContext<SupabaseClient>();

export const resendContext = createContext<Resend>();
