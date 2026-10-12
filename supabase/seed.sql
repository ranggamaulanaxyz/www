-- Seed data for development
-- Insert user_groups
INSERT INTO
    public.user_groups (id, name)
VALUES
    (
        '10a09087-ffc0-4f64-a4a5-f64d3570e6f9',
        'Internal Users'
    );


INSERT INTO
    public.user_groups (id, name, inherit_id)
VALUES
    (
        'c85a09a4-3c96-4ce6-b073-6a10969aa107',
        'Administrator',
        '10a09087-ffc0-4f64-a4a5-f64d3570e6f9'
    );