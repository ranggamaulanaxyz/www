CREATE TRIGGER update_user_groups_updated_at BEFORE
UPDATE ON public.user_groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column ();