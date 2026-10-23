-- Seed data for development
-- Login user: admin@example.com / admin123

-- Insert user_groups
INSERT INTO
    public.user_groups (id, name)
VALUES
    (
        '10a09087-ffc0-4f64-a4a5-f64d3570e6f9',
        'Internal Users'
    )
ON CONFLICT DO NOTHING;


INSERT INTO
    public.user_groups (id, name, inherit_id)
VALUES
    (
        'c85a09a4-3c96-4ce6-b073-6a10969aa107',
        'Administrator',
        '10a09087-ffc0-4f64-a4a5-f64d3570e6f9'
    )
ON CONFLICT DO NOTHING;


-- Sample login user
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change,
        email_change_token_new,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    )
VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        'a0000000-0000-4000-8000-000000000001',
        'authenticated',
        'authenticated',
        'admin@example.com',
        crypt('admin123', gen_salt('bf')),
        now(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"Administrator","email_verified":true}'::jsonb,
        now(),
        now()
    )
ON CONFLICT DO NOTHING;


-- Email identity is required for password sign-in
INSERT INTO
    auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
VALUES
    (
        'a0000000-0000-4000-8000-000000000003',
        'a0000000-0000-4000-8000-000000000001',
        'a0000000-0000-4000-8000-000000000001',
        '{"sub":"a0000000-0000-4000-8000-000000000001","email":"admin@example.com","email_verified":true,"phone_verified":false}'::jsonb,
        'email',
        now(),
        now(),
        now()
    )
ON CONFLICT DO NOTHING;


-- Attach the sample user to the Administrator group
INSERT INTO
    public.user_group_relations (user_id, group_id)
VALUES
    (
        'a0000000-0000-4000-8000-000000000001',
        'c85a09a4-3c96-4ce6-b073-6a10969aa107'
    )
ON CONFLICT DO NOTHING;


-- Sample partner linked to the login user
INSERT INTO
    public.partners (id, user_id, name, nickname, email, phone)
VALUES
    (
        'a0000000-0000-4000-8000-000000000002',
        'a0000000-0000-4000-8000-000000000001',
        'Administrator',
        'Admin',
        'admin@example.com',
        '+6281234567890'
    )
ON CONFLICT DO NOTHING;
