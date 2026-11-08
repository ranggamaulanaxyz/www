import { type RouteConfig, index, route } from "@react-router/dev/routes";

const accounting = [
  route("accounting", "features/accounting/routes/accounting.tsx", [
    route("moves", "features/accounting/routes/account-move.tsx", [
      route("new", "features/accounting/routes/account-move-create.tsx"),
      route(
        ":accountMoveId",
        "features/accounting/routes/account-move-update.tsx",
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
] satisfies RouteConfig;

const product = [
  route("products", "features/product/routes/product.tsx", [
    route("new", "features/product/routes/product-create.tsx"),
    route(":productId", "features/product/routes/product-update.tsx"),
  ]),

  route("product-brands", "features/product/routes/product-brand.tsx", [
    route(
      ":productBrandId",
      "features/product/routes/product-brand-update.tsx",
    ),
  ]),
  route("product-categories", "features/product/routes/product-category.tsx", [
    route(
      ":productCategoryId",
      "features/product/routes/product-category-update.tsx",
    ),
  ]),
] satisfies RouteConfig;

const partner = [
  route("partners", "features/partner/routes/list.tsx", [
    route("titles", "features/partner/routes/title-list.tsx"),
    route(":partnerId", "features/partner/routes/form.tsx"),
  ]),
] satisfies RouteConfig;

const desk = [
  route("/desk", "features/desk/routes/desk.tsx", [
    route("dashboard", "features/desk/routes/dashboard.tsx"),
    ...partner,
    ...accounting,
    ...product,
    route("/desk/telegram", "features/telegram/routes/bot-setting.tsx"),

    route("/desk/me", "features/auth/routes/account.tsx"),
  ]),
] satisfies RouteConfig;

const auth = [
  route("/signin", "features/auth/routes/signin.tsx"),
  route("/signout", "features/auth/routes/signout.tsx"),
  route("/password/reset", "features/auth/routes/reset-password.tsx"),
  route("/password/recovery", "features/auth/routes/password-recovery.tsx"),
] satisfies RouteConfig;

const website = [route("/contact/me", "features/website/routes/contact.tsx")];

export default [
  index("features/website/routes/home.tsx"),
  ...website,
  ...auth,
  ...desk,
  route("/webhook/telegram", "features/telegram/routes/webhook.ts"),
] satisfies RouteConfig;
