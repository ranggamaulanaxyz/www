import { env } from "cloudflare:workers";

export function getEnv<K extends keyof Env>(key: K): Env[K] {
  return env[key] ?? import.meta.env[key];
}
