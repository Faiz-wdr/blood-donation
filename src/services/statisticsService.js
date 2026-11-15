import { supabase } from '../lib/supabase.js';
import { BLOOD_GROUPS } from '../data/bloodGroups.js';

/**
 * Service to retrieve secure aggregated public donor counts.
 * Uses SECURITY DEFINER function `get_public_donor_counts()` in Supabase.
 * Strictly guarantees that no personal donor information is ever queried or exposed.
 */
export async function fetchPublicDonorCounts(district = null) {
  try {
    const rpcParam = district && district !== 'All Districts' ? district : null;

    const { data, error } = await supabase.rpc('get_public_donor_counts', {
      p_district: rpcParam,
    });

    if (error) {
      console.warn('[statisticsService] get_public_donor_counts RPC returned error:', error.message);
      return {
        success: false,
        error: error.message,
        isDatabaseError: true,
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'No data received from Supabase.',
        isDatabaseError: true,
      };
    }

    // Standardize returned data: ensure all 8 blood groups exist with numeric counts
    const rawGroups = data.groups || {};
    const groupCounts = BLOOD_GROUPS.map((group) => ({
      group,
      count: Number(rawGroups[group] || 0),
    }));

    const total = Number(data.total || 0);

    return {
      success: true,
      data: {
        total,
        formattedTotal: `${total.toLocaleString('en-IN')}`,
        groups: groupCounts,
        district: data.district || 'All Districts',
      },
    };
  } catch (err) {
    console.error('[statisticsService] Unexpected error fetching donor counts:', err);
    return {
      success: false,
      error: 'Unable to connect to live database.',
      isDatabaseError: true,
    };
  }
}
