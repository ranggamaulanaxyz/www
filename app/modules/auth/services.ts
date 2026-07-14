import { isAuthSessionMissingError, type SupabaseClient } from "@supabase/supabase-js";
import type { SignupSchema, SigninSchema, ForgotPasswordSchema } from "./schemas";
import type { User } from "./types";
import { getPartnerById } from "../partner/repositories";

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
    return {success: false, data: null, error: response.error}
  } else if (response.error) {
    throw response.error
  }

  return {success: true, data, error: null}
}

export async function userActivation(supabase: SupabaseClient, tokenHash: string) {
  const {data, error} = await supabase.auth.verifyOtp({token_hash: tokenHash, type: 'email'})
  if (error) {
    if (error.code === 'otp_expired') {
      return {success: false, error}
    }
    throw error
  }

  return {success: true}
}

export async function userSignIn(supabase: SupabaseClient, data: SigninSchema) {
  const response = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })

  if (response.error) {
    if(response.error.code === "invalid_credentials") {
      return {success: false, data: null, error: response.error}
    }

    throw response.error
  }

  return {success: true, data: response.data, error: null}
}

export async function getUser(supabase: SupabaseClient): Promise<User | null> {
  const {data, error} = await supabase.auth.getUser()

  if(error) {
    if(isAuthSessionMissingError(error)) {
      return null
    }
    throw error
  }

  const partner = await getPartnerById(supabase, data.user.id)

  if (!partner) {
    return null
  }

  return {
    id: data.user.id,
    name: partner.name,
    lastName: partner.last_name,
    email: partner.email,
    verifiedAt: data.user.email_confirmed_at
  }
}

export async function userSignOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }

  return {success: true}
}

export async function sendEmailResetPassword(supabase: SupabaseClient, data: ForgotPasswordSchema) {
  const response = await supabase.auth.resetPasswordForEmail(data.email)
  if(response.error) {
    throw response.error
  }

  return {success: true}
}