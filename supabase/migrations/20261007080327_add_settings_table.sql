
  create table "public"."settings" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "key" text not null,
    "value" text not null,
    "description" text
      );


alter table "public"."settings" enable row level security;

CREATE UNIQUE INDEX settings_pkey ON public.settings USING btree (id);

alter table "public"."settings" add constraint "settings_pkey" PRIMARY KEY using index "settings_pkey";

grant references on table "public"."settings" to "anon";

grant trigger on table "public"."settings" to "anon";

grant truncate on table "public"."settings" to "anon";

grant references on table "public"."settings" to "authenticated";

grant trigger on table "public"."settings" to "authenticated";

grant truncate on table "public"."settings" to "authenticated";

grant references on table "public"."settings" to "service_role";

grant trigger on table "public"."settings" to "service_role";

grant truncate on table "public"."settings" to "service_role";


