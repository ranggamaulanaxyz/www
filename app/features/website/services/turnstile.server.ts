import { getEnv } from "~/utils/env.server";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const PRODUCTION_HOSTNAMES = ["ranggamaulana.xyz", "www.ranggamaulana.xyz"];
const DEVELOPMENT_HOSTNAMES = ["localhost", "127.0.0.1"];

type SiteverifyResult = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

function expectedHostnames() {
  return new Set(
    import.meta.env.DEV
      ? [...PRODUCTION_HOSTNAMES, ...DEVELOPMENT_HOSTNAMES]
      : PRODUCTION_HOSTNAMES,
  );
}

/**
 * Memvalidasi token Turnstile langsung ke Cloudflare (siteverify).
 * Fail closed: semua kegagalan jaringan, respons non-2xx, action yang tidak
 * cocok, atau hostname di luar allowlist dianggap token tidak valid.
 */
export async function verifyTurnstile({
  token,
  action,
  remoteIp,
}: {
  token: FormDataEntryValue | null;
  action: string;
  remoteIp?: string | null;
}) {
  const hostnames = expectedHostnames();

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    hostnames.size === 0
  ) {
    return false;
  }

  const secret = getEnv("CLOUDFLARE_TURNSTILE_SECRET");

  if (!secret) {
    return false;
  }

  let result: SiteverifyResult;

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(`siteverify ${response.status}`);
    }

    result = await response.json();
  } catch {
    return false;
  }

  return Boolean(
    result.success &&
    result.action === action &&
    result.hostname &&
    hostnames.has(result.hostname),
  );
}
