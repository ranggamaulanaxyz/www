-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Insert admin user if not exists
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    phone_change,
    phone_change_token
)
VALUES (
    'e39df16a-939e-4e6f-b258-0cb93a1cf55b',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"name": "Admin", "last_name": "User", "term_accepted": true}'::jsonb,
    now(),
    now(),
    false,
    '',
    '',
    '',
    '',
    '',
    ''
)
ON CONFLICT (id) DO NOTHING;

-- Insert identity for the admin user if not exists
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
VALUES (
    'e39df16a-939e-4e6f-b258-0cb93a1cf55b',
    'e39df16a-939e-4e6f-b258-0cb93a1cf55b',
    '{"sub": "e39df16a-939e-4e6f-b258-0cb93a1cf55b", "email": "admin@example.com"}'::jsonb,
    'email',
    'admin@example.com',
    now(),
    now(),
    now()
)
ON CONFLICT (provider, provider_id) DO NOTHING;
