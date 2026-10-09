import {
  createContext,
  redirect,
  type RouterContextProvider,
} from "react-router";
import { supabaseClientContext } from "~/context";

export type UserSession = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: "bearer";
  expiresAt?: number;
};

export const userSessionContext = createContext<UserSession | null>(null);

export type User = {
  id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  confirmationSentAt?: string;
  confirmedAt?: string;
  bannedUntil?: string;
  deletedAt?: string;
};

export const userContext = createContext<User | null>(null);

export async function authMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  const supabase = context.get(supabaseClientContext);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    context.set(userSessionContext, {
      accessToken: session.access_token,
      expiresIn: session.expires_in,
      refreshToken: session.refresh_token,
      tokenType: session.token_type,
      expiresAt: session.expires_at,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    context.set(userContext, {
      id: user.id,
      firstName: user.user_metadata.firstName || user.user_metadata.name,
      middleName: user.user_metadata.middleName,
      lastName: user.user_metadata.lastName,
      email: user.email,
      confirmationSentAt: user.confirmation_sent_at,
      confirmedAt: user.confirmed_at,
      bannedUntil: user.banned_until,
      deletedAt: user.deleted_at,
    });
  }
}

export async function userOnlyMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  const user = context.get(userContext);
  if (!user) {
    throw redirect("/signin");
  }
}

export async function guestOnlyMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  const user = context.get(userContext);
  if (user) {
    throw redirect("/");
  }
}
