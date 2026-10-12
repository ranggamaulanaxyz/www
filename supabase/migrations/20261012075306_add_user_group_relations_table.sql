
  create table "public"."user_group_relations" (
    "user_id" uuid not null,
    "group_id" uuid not null
      );


alter table "public"."user_group_relations" enable row level security;

CREATE UNIQUE INDEX user_group_relations_pkey ON public.user_group_relations USING btree (user_id, group_id);

alter table "public"."user_group_relations" add constraint "user_group_relations_pkey" PRIMARY KEY using index "user_group_relations_pkey";

alter table "public"."user_group_relations" add constraint "user_group_relations_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.user_groups(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_group_relations" validate constraint "user_group_relations_group_id_fkey";

alter table "public"."user_group_relations" add constraint "user_group_relations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_group_relations" validate constraint "user_group_relations_user_id_fkey";

grant references on table "public"."user_group_relations" to "anon";

grant trigger on table "public"."user_group_relations" to "anon";

grant truncate on table "public"."user_group_relations" to "anon";

grant references on table "public"."user_group_relations" to "authenticated";

grant trigger on table "public"."user_group_relations" to "authenticated";

grant truncate on table "public"."user_group_relations" to "authenticated";

grant references on table "public"."user_group_relations" to "service_role";

grant trigger on table "public"."user_group_relations" to "service_role";

grant truncate on table "public"."user_group_relations" to "service_role";


