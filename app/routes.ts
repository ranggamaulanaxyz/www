import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/website/routes/home.tsx"),
  route("/contact/me", "features/website/routes/contact.tsx"),

  route("/signin", "features/auth/routes/signin.tsx"),

  route("/app/assistant/chat", "features/assistant/routes/chat.tsx"),
  route("/app/assistant/ai", "features/assistant/routes/ai.tsx"),
] satisfies RouteConfig;
