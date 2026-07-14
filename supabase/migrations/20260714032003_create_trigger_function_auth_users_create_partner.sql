CREATE OR REPLACE FUNCTION logic.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.partners (id, name, last_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        NEW.raw_user_meta_data->>'last_name',
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION logic.handle_auth_user_created();
