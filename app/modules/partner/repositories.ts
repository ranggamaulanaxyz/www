import type { SupabaseClient } from "@supabase/supabase-js";

export async function getPartnerById(supabase: SupabaseClient, id: string) {
    const {data, error} = await supabase.from("partners").select("*").eq("id", id).single();
    if(error) {
        throw error
    }
    return data as {
        id: string,
        name: string,
        last_name?: string,
        email: string,
    }
}