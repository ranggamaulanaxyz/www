WITH new_drive AS (
    INSERT INTO public.drives (name, provider, updated_at)
    VALUES ('Main Drive', 'r2', NOW())
    RETURNING id
)
INSERT INTO public.settings (key, value)
SELECT 'app.drive', id::text
FROM new_drive;
