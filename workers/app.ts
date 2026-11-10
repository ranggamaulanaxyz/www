import { createRequestHandler } from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request) {
    return requestHandler(request);
  },
  async queue(batch) {
    for (const message of batch.messages) {
      message.body;
    }
  },
} satisfies ExportedHandler<Env>;
