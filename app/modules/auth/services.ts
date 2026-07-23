import {
  isAuthSessionMissingError,
  type SupabaseClient,
} from "@supabase/supabase-js";
import type {
  SignupSchema,
  SigninSchema,
  ForgotPasswordSchema,
} from "./schemas";
import type { User } from "./types";
import { getPartnerById } from "../partner/repositories";
import type { ValidationErrorDetail } from "~/types";

export async function userSignUp(supabase: SupabaseClient, data: SignupSchema) {
  const response = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${import.meta.env.PUBLIC_APP_URL}/signup/activation`,
      data: {
        name: data.name,
        last_name: data.lastName,
        term_accepted: data.termAccepted,
      },
    },
  });

  if (response.error && response.error.status === 422) {
    return { success: false, data: null, error: response.error };
  } else if (response.error) {
    throw response.error;
  }

  return { success: true, data, error: null };
}

export async function userVerify(supabase: SupabaseClient, tokenHash: string) {
  const response = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });

  if (response.error) {
    let error: ValidationErrorDetail;
    switch (response.error.code) {
      case "otp_expired":
        error = {
          code: response.error.code,
          title: "Link is expired or invalid",
          message:
            "This link has expired or invalid. Please request a new verification email and try again.",
        };
        break;
      case "over_request_rate_limit":
        error = {
          code: response.error.code,
          title: "Too Many Requests",
          message:
            "You've made too many attempts. Please wait a few minutes before trying again.",
        };
        break;
      default:
        throw response.error;
    }
    return { success: false, data: null, error };
  }

  return {
    success: true,
    data: response.data,
    error: null,
  };
}

export async function resendUserSignupVerification(
  supabase: SupabaseClient,
  email: string,
) {
  const response = await supabase.auth.resend({
    type: "signup",
    email: email,
    options: {
      emailRedirectTo: `${import.meta.env.PUBLIC_APP_URL}/signup/activation`,
    },
  });
}

export async function userSignIn(supabase: SupabaseClient, data: SigninSchema) {
  const response = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (response.error) {
    let error: ValidationErrorDetail;
    switch (response.error.code) {
      case "invalid_credentials":
        error = {
          message: "The credentials you provided aren't correct",
        };
        break;
      case "email_not_confirmed":
        error = {
          message:
            "Your email address hasn't been confirmed. Please check your email to confirm your account.",
        };
        break;
      default:
        throw response.error;
    }

    return {
      success: false,
      data: null,
      error: error,
    };
  }

  return { success: true, data: response.data, error: null };
}

export async function getUser(supabase: SupabaseClient): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    if (isAuthSessionMissingError(error)) {
      return null;
    }
    throw error;
  }

  const partner = await getPartnerById(supabase, data.user.id);

  if (!partner) {
    return null;
  }

  return {
    id: data.user.id,
    name: partner.name,
    lastName: partner.last_name,
    email: partner.email,
    verifiedAt: data.user.email_confirmed_at,
    timeZone: partner.timezone,
  };
}

export async function userSignOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function sendEmailResetPassword(
  supabase: SupabaseClient,
  data: ForgotPasswordSchema,
) {
  const response = await supabase.auth.resetPasswordForEmail(data.email);
  if (response.error) {
    throw response.error;
  }

  return { success: true };
}
