/// <reference types="@cloudflare/workers-types" />
import { createRequestHandler } from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
);

export default {
  async fetch(request: Request) {
    return requestHandler(request);
  },
} satisfies ExportedHandler<Env>;
