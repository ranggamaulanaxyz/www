-- Grant API access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;

-- Grant read-only API access to anonymous/unauthenticated users (if public)
GRANT SELECT ON public.settings TO anon;
