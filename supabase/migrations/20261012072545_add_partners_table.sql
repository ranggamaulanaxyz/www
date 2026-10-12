
  create table "public"."partners" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "first_name" text not null,
    "middle_name" text,
    "last_name" text,
    "email" text,
    "phone" text,
    "user_id" uuid
      );


alter table "public"."partners" enable row level security;

CREATE UNIQUE INDEX partners_pkey ON public.partners USING btree (id);

alter table "public"."partners" add constraint "partners_pkey" PRIMARY KEY using index "partners_pkey";

alter table "public"."partners" add constraint "partners_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."partners" validate constraint "partners_user_id_fkey";

grant references on table "public"."partners" to "anon";

grant trigger on table "public"."partners" to "anon";

grant truncate on table "public"."partners" to "anon";

grant references on table "public"."partners" to "authenticated";

grant trigger on table "public"."partners" to "authenticated";

grant truncate on table "public"."partners" to "authenticated";

grant references on table "public"."partners" to "service_role";

grant trigger on table "public"."partners" to "service_role";

grant truncate on table "public"."partners" to "service_role";

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


