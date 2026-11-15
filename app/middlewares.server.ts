import type { RouterContextProvider } from "react-router";
import { createAdminClient, createClient } from "./utils/supabase.server";
import {
  resendContext,
  supabaseAdminClientContext,
  supabaseClientContext,
} from "./context";
import { Resend } from "resend";
import { env } from "process";

export async function supabaseMiddleware(
  {
    request,
    context,
  }: {
    request: Request;
    context: Readonly<RouterContextProvider>;
  },
  next: () => Promise<Response>,
) {
  const { supabase, headers } = createClient(request);
  context.set(supabaseClientContext, supabase);

  const supabaseAdmin = createAdminClient();
  context.set(supabaseAdminClientContext, supabaseAdmin);

  const response = await next();

  headers.forEach((value, key) => {
    response.headers.append(key, value);
  });

  return response;
}

export async function resendMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  const resend = new Resend(env.RESEND_API_KEY);
  context.set(resendContext, resend);
}
