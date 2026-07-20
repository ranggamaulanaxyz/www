ALTER TABLE public.posts ALTER COLUMN user_id SET DEFAULT auth.uid();
