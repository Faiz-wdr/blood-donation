import { supabase } from '../lib/supabase.js';
import { donorRegistrationSchema } from '../utils/validation.js';

/**
 * Service to handle voluntary donor registrations and admin operations in Supabase.
 */

export async function registerDonor(formData) {
  try {
    const validationResult = donorRegistrationSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      return {
        success: false,
        error: firstIssue?.message || 'Invalid form details. Please check your inputs.',
      };
    }

    const validatedData = validationResult.data;

    const payload = {
      full_name: validatedData.fullName,
      phone: validatedData.mobileNumber,
      age: validatedData.age,
      gender: validatedData.gender,
      blood_group: validatedData.bloodGroup,
      last_donation_date: validatedData.lastDonationDate || null,
      willing_to_donate:
        validatedData.willingToDonate === 'Yes' ||
        validatedData.willingToDonate === 'true',
      district: validatedData.district,
      local_body: validatedData.panchayat,
      location: validatedData.place,
      consent: true,
      status: 'pending',
    };

    const { error } = await supabase.from('donors').insert([payload]);

    if (error) {
      console.error('[donorService] Registration insertion failed:', error);
      return {
        success: false,
        error:
          error.message ||
          'Unable to complete registration. Please try again or contact our coordinator helpline.',
      };
    }

    return {
      success: true,
      name: validatedData.fullName,
    };
  } catch (err) {
    console.error('[donorService] Unexpected registration exception:', err);
    return {
      success: false,
      error: 'A network or system error occurred. Please try again later.',
    };
  }
}

/**
 * Admin: Query donors with search, filtering, and pagination.
 */
export async function fetchDonors({
  search = '',
  bloodGroup = 'all',
  district = 'all',
  status = 'all',
  page = 1,
  pageSize = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
}) {
  try {
    let query = supabase.from('donors').select('*', { count: 'exact' });

    // Search by name, phone, or donor code
    const cleanSearch = search.trim();
    if (cleanSearch) {
      query = query.or(`full_name.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%,donor_code.ilike.%${cleanSearch}%`);
    }

    // Filter by blood group
    if (bloodGroup && bloodGroup !== 'all') {
      query = query.eq('blood_group', bloodGroup);
    }

    // Filter by district
    if (district && district !== 'all') {
      query = query.eq('district', district);
    }

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      donors: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize) || 1,
    };
  } catch (err) {
    console.error('[donorService] fetchDonors error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Fetch all matching donors without pagination limit for CSV & PDF export.
 */
export async function fetchDonorsForExport({
  search = '',
  bloodGroup = 'all',
  district = 'all',
  status = 'all',
}) {
  try {
    let query = supabase.from('donors').select('*');

    const cleanSearch = search.trim();
    if (cleanSearch) {
      query = query.or(`full_name.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%,donor_code.ilike.%${cleanSearch}%`);
    }

    if (bloodGroup && bloodGroup !== 'all') {
      query = query.eq('blood_group', bloodGroup);
    }

    if (district && district !== 'all') {
      query = query.eq('district', district);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, donors: data || [] };
  } catch (err) {
    console.error('[donorService] fetchDonorsForExport error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Update donor verification status.
 */
export async function updateDonorStatus(donorId, newStatus) {
  try {
    const validStatuses = ['pending', 'verified', 'rejected', 'inactive'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid status value.' };
    }

    const { data, error } = await supabase
      .from('donors')
      .update({ status: newStatus })
      .eq('id', donorId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, donor: data };
  } catch (err) {
    console.error('[donorService] updateDonorStatus error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Update donor details.
 */
export async function updateDonorDetails(donorId, updatedFields) {
  try {
    const { data, error } = await supabase
      .from('donors')
      .update(updatedFields)
      .eq('id', donorId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, donor: data };
  } catch (err) {
    console.error('[donorService] updateDonorDetails error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Delete a donor record.
 */
export async function deleteDonor(donorId) {
  try {
    const { error } = await supabase
      .from('donors')
      .delete()
      .eq('id', donorId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[donorService] deleteDonor error:', err);
    return { success: false, error: err.message };
  }
}
