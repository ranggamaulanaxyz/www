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
}

export async function userOnlyMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  const session = context.get(userSessionContext);
  if (!session) {
    throw redirect("/signin");
  }
}

export async function guestOnlyMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  const session = context.get(userSessionContext);
  if (session) {
    throw redirect("/");
  }
}
