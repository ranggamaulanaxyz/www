import { SupabaseClient } from "@supabase/supabase-js";
import {
  createContext as createReactContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "~/utils/supabase.client";

const SupabaseClientContext = createReactContext<SupabaseClient | null>(null);

export function SupabaseProvider({
  value,
  children,
}: {
  value: SupabaseClient;
  children: ReactNode;
}) {
  return (
    <SupabaseClientContext.Provider value={value}>
      {children}
    </SupabaseClientContext.Provider>
  );
}

export function useSupabase() {
  const supabase = useContext(SupabaseClientContext);

  if (!supabase) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return supabase;
}
