import {
  createRequestHandler,
  createContext,
  RouterContextProvider,
} from "react-router";

export interface CloudflareContext {
  env: Env;
  ctx: ExecutionContext;
}

export const CloudflareContext = createContext<CloudflareContext | null>(null);

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const loadContext = new RouterContextProvider();
    loadContext.set(CloudflareContext, { env, ctx });
    return requestHandler(request, loadContext);
  },
} satisfies ExportedHandler<Env>;
