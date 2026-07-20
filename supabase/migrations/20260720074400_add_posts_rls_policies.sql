-- Enable insert, update, and delete access for authenticated users on public.posts
CREATE POLICY "Enable insert for authenticated users based on user_id" ON public.posts
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.posts
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON public.posts
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);
