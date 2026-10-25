import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/website/routes/home.tsx"),
  route("/contact/me", "features/website/routes/contact.tsx"),

  route("/signin", "features/auth/routes/signin.tsx"),
  route("/signout", "features/auth/routes/signout.tsx"),
  route("/password/reset", "features/auth/routes/reset-password.tsx"),
  route("/password/recovery", "features/auth/routes/password-recovery.tsx"),

  route("/desk", "features/desk/routes/desk.tsx", [
    route("dashboard", "features/desk/routes/dashboard.tsx"),
    route("partners", "features/partner/routes/list.tsx", [
      route("titles", "features/partner/routes/title-list.tsx"),
      route(":partnerId", "features/partner/routes/form.tsx"),
    ]),

    route("accounting", "features/accounting/routes/accounting.tsx", [
      route("moves", "features/accounting/routes/account-move.tsx", [
        route(
          ":accountMoveId",
          "features/accounting/routes/account-move-form.tsx",
        ),
      ]),
      route("move-items", "features/accounting/routes/account-move-item.tsx", [
        route(
          ":accountMoveItemId",
          "features/accounting/routes/account-move-item-form.tsx",
        ),
      ]),
      route("journals", "features/accounting/routes/account-journal.tsx", [
        route(
          ":accountJournalId",
          "features/accounting/routes/account-journal-form.tsx",
        ),
      ]),
      route("accounts", "features/accounting/routes/account.tsx", [
        route(":accountId", "features/accounting/routes/account-form.tsx"),
      ]),
      route("subtypes", "features/accounting/routes/account-subtype.tsx", [
        route(
          ":accountSubtypeId",
          "features/accounting/routes/account-subtype-form.tsx",
        ),
      ]),
    ]),

    route("/desk/products", "features/product/routes/product.tsx", [
      route("new", "features/product/routes/product-create.tsx"),
    ]),

    route("/desk/me", "features/auth/routes/account.tsx"),
  ]),
] satisfies RouteConfig;
