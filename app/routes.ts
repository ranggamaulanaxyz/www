import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/website/routes/home.tsx"),
  route("/contact/me", "features/website/routes/contact.tsx"),

  route("/signin", "features/auth/routes/signin.tsx"),
  route("/signout", "features/auth/routes/signout.tsx"),
  route("/password/reset", "features/auth/routes/reset-password.tsx"),
  route("/password/recovery", "features/auth/routes/password-recovery.tsx"),

  route("/zet/webhook/telegram", "features/zet/routes/telegram.ts"),

  route("/desk", "features/desk/routes/desk.tsx", [
    route("dashboard", "features/desk/routes/dashboard.tsx"),
    route("partners", "features/partner/routes/list.tsx", [
      route("titles", "features/partner/routes/title-list.tsx"),
      route(":partnerId", "features/partner/routes/form.tsx"),
    ]),
    route("/desk/me", "features/auth/routes/account.tsx"),
    route("/desk/assistant", "features/assistant/routes/chat.tsx"),
  ]),
] satisfies RouteConfig;
