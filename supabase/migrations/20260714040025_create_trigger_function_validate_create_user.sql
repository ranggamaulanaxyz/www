CREATE OR REPLACE FUNCTION logic.validate_create_user()
RETURNS TRIGGER AS $$
BEGIN
    IF current_setting('role', true) = 'supabase_admin' THEN
        RETURN NEW;
    END IF;

    IF NEW.raw_user_meta_data IS NULL OR (NEW.raw_user_meta_data->>'term_accepted')::boolean IS NOT TRUE THEN
        RAISE EXCEPTION 'You must agree to the Terms and Conditions.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER check_terms_before_signup
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION logic.validate_create_user();