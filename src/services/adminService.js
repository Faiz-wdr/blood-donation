import { supabase } from '../lib/supabase.js';

/**
 * Admin Service:
 * Handles Supabase email/password authentication and checks authorization
 * against the secure `admin_users` table.
 */

export async function signInAdmin(email, password) {
  try {
    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      return {
        success: false,
        error: authError.message || 'Invalid email or password.',
      };
    }

    if (!authData?.user) {
      return {
        success: false,
        error: 'Authentication failed. No user record returned.',
      };
    }

    // 2. Authorize against admin_users table
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('id, full_name, role, is_active')
      .eq('auth_user_id', authData.user.id)
      .maybeSingle();

    if (adminError) {
      console.error('[adminService] Error querying admin profile:', adminError);
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Unable to verify administrator permissions. Contact the system administrator.',
      };
    }

    if (!adminRecord || !adminRecord.is_active) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Access denied: This account is not an authorized or active administrator.',
      };
    }

    return {
      success: true,
      user: authData.user,
      adminProfile: adminRecord,
    };
  } catch (err) {
    console.error('[adminService] Unexpected sign in error:', err);
    return {
      success: false,
      error: 'An unexpected connection error occurred. Please try again.',
    };
  }
}

export async function signOutAdmin() {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    console.error('[adminService] Sign out error:', err);
    return { success: false, error: err.message };
  }
}

export async function verifyCurrentAdmin() {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      return null;
    }

    const user = sessionData.session.user;

    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('id, full_name, role, is_active')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (adminError || !adminRecord || !adminRecord.is_active) {
      return null;
    }

    return {
      user,
      adminProfile: adminRecord,
    };
  } catch (err) {
    console.error('[adminService] Session verification error:', err);
    return null;
  }
}

export async function fetchAdminDashboardStats() {
  try {
    // Attempt RPC first
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');

    if (!error && data) {
      return {
        success: true,
        stats: {
          total: Number(data.total || 0),
          verified: Number(data.verified || 0),
          pending: Number(data.pending || 0),
          inactive: Number(data.inactive || 0),
          rejected: Number(data.rejected || 0),
          groups: data.groups || {},
        },
      };
    }

    // Direct query fallback for admin session if RPC is not yet executed
    const { data: allDonors, error: queryError } = await supabase
      .from('donors')
      .select('status, blood_group, willing_to_donate');

    if (queryError) {
      return { success: false, error: queryError.message };
    }

    let total = allDonors.length;
    let verified = 0;
    let pending = 0;
    let inactive = 0;
    let rejected = 0;
    const groups = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0 };

    allDonors.forEach((d) => {
      if (d.status === 'verified') {
        verified++;
        if (d.willing_to_donate && groups[d.blood_group] !== undefined) {
          groups[d.blood_group]++;
        }
      } else if (d.status === 'pending') {
        pending++;
      } else if (d.status === 'inactive') {
        inactive++;
      } else if (d.status === 'rejected') {
        rejected++;
      }
    });

    return {
      success: true,
      stats: { total, verified, pending, inactive, rejected, groups },
    };
  } catch (err) {
    console.error('[adminService] fetchAdminDashboardStats error:', err);
    return { success: false, error: err.message };
  }
}

export async function fetchRecentDonors(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('id, full_name, phone, blood_group, district, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, donors: data || [] };
  } catch (err) {
    console.error('[adminService] fetchRecentDonors error:', err);
    return { success: false, error: err.message };
  }
}

