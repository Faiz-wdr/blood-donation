-- ==============================================================================
-- BLOOD CONNECT KERALA — PHASE 02 DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- Description: Creates donors, blood_requests, indexes, RLS policies,
--              triggers, and secure aggregation functions.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE: donors
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'A2B-', 'Oh (Bombay Blood Group)', 'Rh-null', 'Fy-a-b-', 'Jk-a-b-', 'K0', 'Dia+', 'Lu-a-b-', 'Ina+', 'Vel-', 'Yt-a-b-')),
    last_donation_date DATE NULL,
    willing_to_donate BOOLEAN NOT NULL DEFAULT true,
    district TEXT NOT NULL CHECK (district IN (
        'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
        'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
        'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
    )),
    local_body TEXT NOT NULL,
    location TEXT NOT NULL,
    consent BOOLEAN NOT NULL CHECK (consent = true),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'inactive')),
    donor_code TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments on table and columns for documentation
COMMENT ON TABLE public.donors IS 'Voluntary blood donor registration records';
COMMENT ON COLUMN public.donors.status IS 'pending: newly registered; verified: approved by coordinators; rejected: failed screening; inactive: temporarily unavailable';

-- ==============================================================================
-- 3. TABLE: blood_requests
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number TEXT UNIQUE NOT NULL,
    patient_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'A2B-', 'Oh (Bombay Blood Group)', 'Rh-null', 'Fy-a-b-', 'Jk-a-b-', 'K0', 'Dia+', 'Lu-a-b-', 'Ina+', 'Vel-', 'Yt-a-b-')),
    units_required INTEGER NOT NULL CHECK (units_required > 0),
    hospital_name TEXT NOT NULL,
    district TEXT NOT NULL CHECK (district IN (
        'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
        'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
        'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
    )),
    hospital_location TEXT NOT NULL,
    required_date DATE NOT NULL,
    urgency TEXT NOT NULL CHECK (urgency IN ('Emergency', 'Within 24 Hours', 'Planned')),
    additional_info TEXT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'fulfilled', 'unable_to_fulfil', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.blood_requests IS 'Emergency and planned blood requirement requests';

-- ==============================================================================
-- 4. SEQUENCE & AUTOMATIC REFERENCE GENERATION FOR BLOOD REQUESTS
-- ==============================================================================
CREATE SEQUENCE IF NOT EXISTS public.blood_request_ref_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_blood_request_ref()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reference_number IS NULL OR trim(NEW.reference_number) = '' THEN
        NEW.reference_number := 'BCK-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD(nextval('public.blood_request_ref_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_blood_request_ref ON public.blood_requests;
CREATE TRIGGER trigger_generate_blood_request_ref
    BEFORE INSERT ON public.blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_blood_request_ref();

-- ==============================================================================
-- 5. UPDATED_AT TIMESTAMP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_donors_updated_at ON public.donors;
CREATE TRIGGER trigger_donors_updated_at
    BEFORE UPDATE ON public.donors
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_blood_requests_updated_at ON public.blood_requests;
CREATE TRIGGER trigger_blood_requests_updated_at
    BEFORE UPDATE ON public.blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Auto-incrementing Donor Code Sequence & Trigger (BCK-0001, BCK-0002, ...)
CREATE SEQUENCE IF NOT EXISTS public.donor_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.set_donor_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.donor_code IS NULL OR NEW.donor_code = '' THEN
        NEW.donor_code := 'BCK-' || LPAD(nextval('public.donor_number_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_donor_code ON public.donors;
CREATE TRIGGER trigger_set_donor_code
    BEFORE INSERT ON public.donors
    FOR EACH ROW
    EXECUTE FUNCTION public.set_donor_code();

-- Indexes for High-Performance Querying
-- Donors table indexes
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON public.donors (blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_district ON public.donors (district);
CREATE INDEX IF NOT EXISTS idx_donors_status ON public.donors (status);
CREATE INDEX IF NOT EXISTS idx_donors_created_at ON public.donors (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donors_verified_willing ON public.donors (blood_group, district)
    WHERE status = 'verified' AND willing_to_donate = true;

-- Blood requests table indexes
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_group ON public.blood_requests (blood_group);
CREATE INDEX IF NOT EXISTS idx_blood_requests_district ON public.blood_requests (district);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON public.blood_requests (status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_created_at ON public.blood_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blood_requests_ref ON public.blood_requests (reference_number);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on both tables
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

-- Remove any old policies to ensure clean state
DROP POLICY IF EXISTS "Allow public insert for donor registration" ON public.donors;
DROP POLICY IF EXISTS "Deny public select on donors" ON public.donors;
DROP POLICY IF EXISTS "Allow public insert for blood requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Deny public select on blood requests" ON public.blood_requests;

-- DONORS: Public can ONLY insert pending registrations with consent=true.
-- Public users CANNOT SELECT, UPDATE, or DELETE donors.
CREATE POLICY "Allow public insert for donor registration"
    ON public.donors
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'pending'
        AND consent = true
    );

-- BLOOD REQUESTS: Public can ONLY insert new requests.
-- Public users CANNOT SELECT, UPDATE, or DELETE blood requests.
CREATE POLICY "Allow public insert for blood requests"
    ON public.blood_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'new'
    );

-- ==============================================================================
-- 8. SECURE PUBLIC AGGREGATION FUNCTION: get_public_donor_counts()
-- ==============================================================================
-- Counts strictly donors who are: status = 'verified' AND willing_to_donate = true.
-- Returns strictly aggregated numbers. NEVER returns names, phones, IDs, or any PII.
-- Runs as SECURITY DEFINER with fixed search_path.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_public_donor_counts(p_district TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_total BIGINT := 0;
    v_counts JSONB;
    v_filter_district TEXT := NULL;
BEGIN
    -- Normalize district parameter (null if empty or 'All Districts')
    IF p_district IS NOT NULL AND trim(p_district) <> '' AND trim(p_district) <> 'All Districts' THEN
        v_filter_district := trim(p_district);
    END IF;

    -- Aggregate counts for all 19 blood groups (standard + rare)
    WITH standard_groups AS (
        SELECT unnest(ARRAY['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'A2B-', 'Oh (Bombay Blood Group)', 'Rh-null', 'Fy-a-b-', 'Jk-a-b-', 'K0', 'Dia+', 'Lu-a-b-', 'Ina+', 'Vel-', 'Yt-a-b-']) AS blood_group
    ),
    actual_counts AS (
        SELECT
            d.blood_group,
            COUNT(*)::BIGINT AS cnt
        FROM public.donors d
        WHERE d.status = 'verified'
          AND d.willing_to_donate = true
          AND (v_filter_district IS NULL OR d.district = v_filter_district)
        GROUP BY d.blood_group
    ),
    combined AS (
        SELECT
            sg.blood_group,
            COALESCE(ac.cnt, 0)::BIGINT AS count
        FROM standard_groups sg
        LEFT JOIN actual_counts ac ON sg.blood_group = ac.blood_group
    )
    SELECT
        COALESCE(SUM(count), 0),
        jsonb_object_agg(blood_group, count)
    INTO v_total, v_counts
    FROM combined;

    RETURN jsonb_build_object(
        'total', v_total,
        'groups', v_counts,
        'district', COALESCE(v_filter_district, 'All Districts'),
        'timestamp', now()
    );
END;
$$;

-- Grant execution permissions on public RPC function
REVOKE ALL ON FUNCTION public.get_public_donor_counts(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_donor_counts(TEXT) TO anon, authenticated;

-- ==============================================================================
-- 9. PHASE 03: ADMIN USERS & MANAGEMENT PRIVILEGES
-- ==============================================================================
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

DROP TRIGGER IF EXISTS trigger_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trigger_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_admin_users_auth_id ON public.admin_users (auth_user_id) WHERE is_active = true;

-- Function to check admin status safely without recursive RLS
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

REVOKE ALL ON FUNCTION public.is_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

-- Admin users RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user to read own admin record" ON public.admin_users;
CREATE POLICY "Allow user to read own admin record"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = auth_user_id);

-- Admin policies for donors table
DROP POLICY IF EXISTS "Allow admin to select donors" ON public.donors;
DROP POLICY IF EXISTS "Allow admin to update donors" ON public.donors;

CREATE POLICY "Allow admin to select donors"
    ON public.donors
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Allow admin to update donors"
    ON public.donors
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Function for real-time admin dashboard statistics
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
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied: caller is not an authorized administrator.';
    END IF;

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
-- END OF SCHEMA
-- ==============================================================================

