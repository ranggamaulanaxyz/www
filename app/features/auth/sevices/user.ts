import type { SupabaseClient } from "@supabase/supabase-js";

export async function getUserBySession(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    firstName: user.user_metadata.firstName || user.user_metadata.name,
    middleName: user.user_metadata.middleName,
    lastName: user.user_metadata.lastName,
    email: user.email,
    confirmationSentAt: user.confirmation_sent_at,
    confirmedAt: user.confirmed_at,
    bannedUntil: user.banned_until,
    deletedAt: user.deleted_at,
  };
}
