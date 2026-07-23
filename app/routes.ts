import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/signin", "routes/signin.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/signup/confirmation", "routes/signup-confirmation.tsx"),
  route("/signout", "routes/signout.tsx"),
  route("/password/forgot", "routes/password/forgot.tsx"),

  layout("routes/layout.tsx", [
    route("/account", "routes/account/account.tsx", [
      index("routes/account/home.tsx"),
    ]),
  ]),

  route("/desk", "routes/desk/desk.tsx", [
    index("routes/desk/dashboard.tsx"),

    route("drive/", "routes/desk/drive.tsx", [
      index("routes/desk/drive-list.tsx"),
      route("new", "routes/desk/drive-create.tsx"),
      route(":id", "routes/desk/drive-edit.tsx", [
        route("items", "routes/desk/drive-item.tsx"),
      ]),
    ]),

    route("blog/", "routes/desk/blog.tsx", [
      index("routes/desk/blog-list.tsx"),
    ]),
  ]),

  route("/desk/blog/new", "routes/desk/blog-create.tsx"),
  route("/desk/blog/:id", "routes/desk/blog-edit.tsx"),

  route("/drive/upload", "routes/drive/upload.tsx"),
  route("/drive/*", "routes/drive/show.tsx"),
] satisfies RouteConfig;
