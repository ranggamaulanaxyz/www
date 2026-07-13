CREATE TRIGGER update_partner_updated_at
    BEFORE UPDATE ON public.partner
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();