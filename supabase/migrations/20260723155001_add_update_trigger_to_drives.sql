CREATE TRIGGER update_drives_updated_at BEFORE UPDATE ON public.drives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
