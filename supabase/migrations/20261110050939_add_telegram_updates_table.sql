CREATE TYPE "public"."telegram_update_status" AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE TABLE "public"."telegram_updates" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"       timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"       timestamp with time zone,
  "update_id"        bigint                   NOT NULL,
  "message_id"       bigint,
  "telegram_user_id" bigint,
  "chat_id"          bigint,
  "message_date"     timestamp with time zone,
  "status" public.telegram_update_status NOT NULL DEFAULT 'pending'::public.telegram_update_status,
  CONSTRAINT "telegram_updates_pkey" PRIMARY KEY (id),
  CONSTRAINT "telegram_updates_update_id_key" UNIQUE (update_id)
);

ALTER TABLE "public"."telegram_updates"
  ENABLE ROW LEVEL SECURITY;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.telegram_updates TO service_role;

CREATE POLICY "Enable all access for service role" ON public.telegram_updates
  TO service_role
  USING (true)
  WITH CHECK (true);