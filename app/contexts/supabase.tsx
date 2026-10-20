import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  createContext as createReactContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

const SupabaseClientContext = createReactContext<SupabaseClient | null>(null);

export function SupabaseProvider({
  supabaseUrl,
  supabaseKey,
  children,
}: {
  supabaseUrl: string;
  supabaseKey: string;
  children: ReactNode;
}) {
  console.log(supabaseUrl, supabaseKey);
  const [supabase] = useState(() =>
    createBrowserClient(supabaseUrl, supabaseKey),
  );

  return (
    <SupabaseClientContext.Provider value={supabase}>
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
