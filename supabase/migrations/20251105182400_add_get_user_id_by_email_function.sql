-- Function to get user ID by email
create or replace function public.get_user_id_by_email(p_email text)
returns uuid
language plpgsql
security definer
as $$
begin
    return (
        select id
        from auth.users
        where email = p_email
        limit 1
    );
end;
$$;

-- Revoke all permissions from authenticated, anon, and public
revoke all on function public.get_user_id_by_email(text) from authenticated, anon, public;

-- Grant execute permission only to supabase_auth_admin
grant execute on function public.get_user_id_by_email(text) to supabase_auth_admin;
