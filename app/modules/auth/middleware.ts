import { createContext, redirect, type LoaderFunctionArgs } from "react-router";
import type { User } from "./types";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { getUser } from "./services";

export interface AuthContext {
    user: User | null
}

export const AuthContext = createContext<AuthContext | null>(null)

export async function authMiddleware({context}: LoaderFunctionArgs) {
    const supabase = context.get(SupabaseClientContext)
    const user = await getUser(supabase)
    const auth: AuthContext = {
        user: user
    }
    context.set(AuthContext, auth)
}

export function onlyUserMiddleware({context}: LoaderFunctionArgs) {
    const auth = context.get(AuthContext)
    if (auth?.user == null) {
        throw redirect("/signin");
    }    
}

export function onlyGuestMiddleware({context}: LoaderFunctionArgs) {
    const auth = context.get(AuthContext)
    if (auth?.user) {
        throw redirect("/");
    }    
}