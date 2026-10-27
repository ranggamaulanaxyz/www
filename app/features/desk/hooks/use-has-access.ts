import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "~/contexts/supabase";
import { hasAccess } from "../services/access";

export type AccessAction = Parameters<typeof hasAccess>[1];

/**
 * Checks whether the current user has access to an action on a table.
 *
 * Returns `undefined` while the check is in flight, then `true`/`false`.
 * The check re-runs when the action or table changes.
 */
export function useHasAccess(action: AccessAction, table: string) {
  const supabase = useSupabase();
  const [allowed, setAllowed] = useState<boolean>();

  // Memoized so the effect only re-runs when the Supabase client, action, or
  // table changes instead of on every render.
  const checkAccess = useCallback(async () => {
    try {
      return (await hasAccess(supabase, action, table)) ?? false;
    } catch (error) {
      console.error(`Failed to check ${action} access on ${table}`, error);
      return false;
    }
  }, [supabase, action, table]);

  useEffect(() => {
    let active = true;

    checkAccess().then((result) => {
      if (active) setAllowed(result);
    });

    return () => {
      active = false;
    };
  }, [checkAccess]);

  return !!allowed;
}
