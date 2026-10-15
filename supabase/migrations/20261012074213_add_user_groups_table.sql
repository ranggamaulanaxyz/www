
  create table "public"."user_groups" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "name" text not null,
    "inherit_id" uuid
      );


alter table "public"."user_groups" enable row level security;

CREATE UNIQUE INDEX user_groups_name_key ON public.user_groups USING btree (name);

CREATE UNIQUE INDEX user_groups_pkey ON public.user_groups USING btree (id);

alter table "public"."user_groups" add constraint "user_groups_pkey" PRIMARY KEY using index "user_groups_pkey";

alter table "public"."user_groups" add constraint "user_groups_name_key" UNIQUE using index "user_groups_name_key";

alter table "public"."user_groups" add constraint "user_groups_inherit_id_fkey" FOREIGN KEY (inherit_id) REFERENCES public.user_groups(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."user_groups" validate constraint "user_groups_inherit_id_fkey";

grant references on table "public"."user_groups" to "anon";

grant trigger on table "public"."user_groups" to "anon";

grant truncate on table "public"."user_groups" to "anon";

grant references on table "public"."user_groups" to "authenticated";

grant trigger on table "public"."user_groups" to "authenticated";

grant truncate on table "public"."user_groups" to "authenticated";

grant references on table "public"."user_groups" to "service_role";

grant trigger on table "public"."user_groups" to "service_role";

grant truncate on table "public"."user_groups" to "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON public.user_groups TO authenticated;

CREATE POLICY "Enable select access for authenticated users" ON public.user_groups
  FOR SELECT
  TO authenticated
  USING (true);