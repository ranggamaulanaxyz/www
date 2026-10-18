import type { SupabaseClient } from "@supabase/supabase-js";

export async function hasAccess(supabase: SupabaseClient, action: "select" | "insert" | "update" | "delete", table: string) {
    const {data} = await supabase.rpc("has_access", {
        p_action: action,
        p_table: table
    }).overrideTypes<boolean>()

    return data
}