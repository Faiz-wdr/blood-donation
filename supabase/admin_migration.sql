-- ==============================================================================
-- BLOOD CONNECT KERALA — PHASE 03 ADMIN MIGRATION
-- Migration: 002_admin_dashboard.sql
-- Description: Creates admin_users table, admin check function, and RLS policies
--              for authorized admins to view and update donor records.
-- ==============================================================================

-- 1. TABLE: admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admin_users IS 'Authorized administrators linked to Supabase Auth UUID';

-- Updated_at trigger for admin_users
DROP TRIGGER IF EXISTS trigger_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trigger_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Index on auth_user_id
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_id ON public.admin_users (auth_user_id) WHERE is_active = true;

-- 2. SECURITY DEFINER FUNCTION TO VERIFY ADMIN PRIVILEGES SAFELY
-- (Avoids recursive RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE auth_user_id = p_user_id
          AND is_active = true
          AND role IN ('super_admin', 'admin')
    );
$$;

-- Grant execute on is_admin to authenticated
REVOKE ALL ON FUNCTION public.is_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

-- 3. ENABLE RLS ON admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user to read own admin record" ON public.admin_users;
DROP POLICY IF EXISTS "Allow active admin to manage admin_users" ON public.admin_users;

-- Policy: Authenticated users can read their own admin record to verify authorization
CREATE POLICY "Allow user to read own admin record"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = auth_user_id);

-- 4. UPDATE RLS ON donors FOR AUTHORIZED ADMINS
DROP POLICY IF EXISTS "Allow admin to select donors" ON public.donors;
DROP POLICY IF EXISTS "Allow admin to update donors" ON public.donors;
DROP POLICY IF EXISTS "Allow admin to delete donors" ON public.donors;

-- Authorized admins can view all donor details
CREATE POLICY "Allow admin to select donors"
    ON public.donors
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Authorized admins can update donor verification status and details
CREATE POLICY "Allow admin to update donors"
    ON public.donors
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Authorized admins can delete donor records
CREATE POLICY "Allow admin to delete donors"
    ON public.donors
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 5. FUNCTION: get_admin_dashboard_stats()
-- Aggregates real-time stats for total, verified, pending, and inactive donors
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_total BIGINT := 0;
    v_verified BIGINT := 0;
    v_pending BIGINT := 0;
    v_inactive BIGINT := 0;
    v_rejected BIGINT := 0;
    v_groups JSONB;
BEGIN
    -- Verify caller is authorized admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied: caller is not an authorized administrator.';
    END IF;

    -- Overall counts
    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'verified'),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status = 'inactive'),
        COUNT(*) FILTER (WHERE status = 'rejected')
    INTO
        v_total,
        v_verified,
        v_pending,
        v_inactive,
        v_rejected
    FROM public.donors;

    -- Blood group counts for verified, active and willing donors across all 19 groups
    WITH standard_groups AS (
        SELECT unnest(ARRAY['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'A2B-', 'Oh (Bombay Blood Group)', 'Rh-null', 'Fy-a-b-', 'Jk-a-b-', 'K0', 'Dia+', 'Lu-a-b-', 'Ina+', 'Vel-', 'Yt-a-b-']) AS blood_group
    ),
    actual_counts AS (
        SELECT
            blood_group,
            COUNT(*)::BIGINT AS cnt
        FROM public.donors
        WHERE status = 'verified'
          AND willing_to_donate = true
        GROUP BY blood_group
    ),
    combined AS (
        SELECT
            sg.blood_group,
            COALESCE(ac.cnt, 0)::BIGINT AS count
        FROM standard_groups sg
        LEFT JOIN actual_counts ac ON sg.blood_group = ac.blood_group
    )
    SELECT jsonb_object_agg(blood_group, count)
    INTO v_groups
    FROM combined;

    RETURN jsonb_build_object(
        'total', v_total,
        'verified', v_verified,
        'pending', v_pending,
        'inactive', v_inactive,
        'rejected', v_rejected,
        'groups', v_groups,
        'timestamp', now()
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_dashboard_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;


-- ==============================================================================
-- PROVISION ADMIN ACCOUNT: yasimon1010@gmail.com
-- UID: d293faf4-b254-4587-bce1-b0290560d948
-- ==============================================================================
-- 1. Confirm the email in Supabase Auth:
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE id = 'd293faf4-b254-4587-bce1-b0290560d948'
   OR email = 'yasimon1010@gmail.com';

-- 2. Grant super_admin access in admin_users:
INSERT INTO public.admin_users (auth_user_id, full_name, role, is_active)
SELECT id, 'Yasimon', 'super_admin', true
FROM auth.users
WHERE email = 'yasimon1010@gmail.com'
ON CONFLICT (auth_user_id) DO UPDATE 
SET is_active = true, role = 'super_admin';
-- ==============================================================================
