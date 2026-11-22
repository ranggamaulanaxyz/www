import type { AuthError, SupabaseClient } from "@supabase/supabase-js";
import { InvalidCredentialsError } from "../exceptions/auth";

export async function getUserBySession(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    firstName: user.user_metadata?.first_name || user.user_metadata.name,
    middleName: user.user_metadata?.middle_name,
    lastName: user.user_metadata?.last_name,
    email: user.email,
    confirmationSentAt: user.confirmation_sent_at,
    confirmedAt: user.confirmed_at,
    bannedUntil: user.banned_until,
    deletedAt: user.deleted_at,
    prayerTimesCityId: user.user_metadata.prayer_times_city_id,
    timeZone: user.user_metadata.timezone,
  };
}

export async function signInWithPassword(
  supabase: SupabaseClient,
  credentials: { email: string; password: string },
) {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    throw authError(error);
  }

  return data;
}

export async function hasGroup(supabase: SupabaseClient, name: UserGroup) {
  const { data, error } = await supabase
    .rpc("has_group", { p_name: name })
    .single<boolean>();

  if (error) {
    throw error.code;
  }

  return data || false;
}

function authError(error: AuthError) {
  switch (error.code) {
    case "invalid_credentials":
      return new InvalidCredentialsError("Invalid credentials", {
        cause: error,
      });
    case "unexpected_failure":
    case "validation_failed":
    case "bad_json":
    case "email_exists":
    case "phone_exists":
    case "bad_jwt":
    case "not_admin":
    case "no_authorization":
    case "user_not_found":
    case "session_not_found":
    case "session_expired":
    case "refresh_token_not_found":
    case "refresh_token_already_used":
    case "flow_state_not_found":
    case "flow_state_expired":
    case "signup_disabled":
    case "user_banned":
    case "provider_email_needs_verification":
    case "invite_not_found":
    case "bad_oauth_state":
    case "bad_oauth_callback":
    case "oauth_provider_not_supported":
    case "unexpected_audience":
    case "single_identity_not_deletable":
    case "email_conflict_identity_not_deletable":
    case "identity_already_exists":
    case "email_provider_disabled":
    case "phone_provider_disabled":
    case "too_many_enrolled_mfa_factors":
    case "mfa_factor_name_conflict":
    case "mfa_factor_not_found":
    case "mfa_ip_address_mismatch":
    case "mfa_challenge_expired":
    case "webauthn_challenge_expired":
    case "mfa_verification_failed":
    case "mfa_verification_rejected":
    case "insufficient_aal":
    case "captcha_failed":
    case "saml_provider_disabled":
    case "manual_linking_disabled":
    case "sms_send_failed":
    case "email_not_confirmed":
    case "phone_not_confirmed":
    case "reauth_nonce_missing":
    case "saml_relay_state_not_found":
    case "saml_relay_state_expired":
    case "saml_idp_not_found":
    case "saml_assertion_no_user_id":
    case "saml_assertion_no_email":
    case "user_already_exists":
    case "sso_provider_not_found":
    case "saml_metadata_fetch_failed":
    case "saml_idp_already_exists":
    case "sso_domain_already_exists":
    case "saml_entity_id_mismatch":
    case "conflict":
    case "provider_disabled":
    case "user_sso_managed":
    case "reauthentication_needed":
    case "same_password":
    case "reauthentication_not_valid":
    case "otp_expired":
    case "otp_disabled":
    case "identity_not_found":
    case "weak_password":
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
    case "over_sms_send_rate_limit":
    case "bad_code_verifier":
    case "anonymous_provider_disabled":
    case "hook_timeout":
    case "hook_timeout_after_retry":
    case "hook_payload_over_size_limit":
    case "hook_payload_invalid_content_type":
    case "request_timeout":
    case "mfa_phone_enroll_not_enabled":
    case "mfa_phone_verify_not_enabled":
    case "mfa_totp_enroll_not_enabled":
    case "mfa_totp_verify_not_enabled":
    case "mfa_webauthn_enroll_not_enabled":
    case "mfa_webauthn_verify_not_enabled":
    case "mfa_recovery_codes_enroll_not_enabled":
    case "mfa_recovery_codes_verify_not_enabled":
    case "mfa_recovery_codes_locked":
    case "mfa_recovery_codes_sole_factor":
    case "mfa_verified_factor_exists":
    case "email_address_not_authorized":
    case "email_address_invalid":
      return error;

    default:
      return error;
  }
}
