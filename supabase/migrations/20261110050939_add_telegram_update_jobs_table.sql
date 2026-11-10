CREATE TYPE "public"."telegram_bot_job_status" AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE TABLE "public"."telegram_bot_jobs" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"       timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"       timestamp with time zone,
  "update_id"        bigint                   NOT NULL,
  "update_data"      jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  "status" public.telegram_bot_job_status NOT NULL DEFAULT 'pending'::public.telegram_bot_job_status,
  CONSTRAINT "telegram_bot_jobs_pkey" PRIMARY KEY (id),
  CONSTRAINT "telegram_bot_jobs_update_id_key" UNIQUE (update_id)
);

ALTER TABLE "public"."telegram_bot_jobs"
  ENABLE ROW LEVEL SECURITY;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.telegram_bot_jobs TO service_role;

CREATE POLICY "Enable all access for service role" ON public.telegram_bot_jobs
  TO service_role
  USING (true)
  WITH CHECK (true);