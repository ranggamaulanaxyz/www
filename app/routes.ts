import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/website/routes/home.tsx"),
  route("/contact/me", "features/website/routes/contact.tsx"),

  route("/signin", "features/auth/routes/signin.tsx"),

  route("/zet/webhook/telegram", "features/zet/routes/telegram.ts"),

  route("/desk", "features/desk/routes/desk.tsx", [
    route("/desk/me", "features/auth/routes/account.tsx"),
    route("/desk/assistant", "features/assistant/routes/chat.tsx"),
  ]),
] satisfies RouteConfig;
