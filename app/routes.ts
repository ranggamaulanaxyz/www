import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/website/routes/home.tsx"),
  route("/contact/me", "features/website/routes/contact.tsx"),
] satisfies RouteConfig;
