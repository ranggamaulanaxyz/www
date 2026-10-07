set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;$function$
;

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


