import { supabase } from '../lib/supabase.js';
import { bloodRequestSchema } from '../utils/validation.js';

/**
 * Generates an accessible, human-readable unique reference number for blood requests.
 * Format: BCK-YYYYMMDD-XXXX (e.g. BCK-20261115-8M2K)
 */
export function generateReferenceNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BCK-${dateStr}-${rand}`;
}

/**
 * Submits an emergency blood requirement request to Supabase.
 */
export async function submitBloodRequest(formData) {
  try {
    // 1. Zod schema validation
    const validationResult = bloodRequestSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      return {
        success: false,
        error: firstIssue?.message || 'Invalid request details. Please check your inputs.',
      };
    }

    const validatedData = validationResult.data;
    const referenceNumber = generateReferenceNumber();

    // 2. Prepare payload matching the Supabase `blood_requests` schema
    const payload = {
      reference_number: referenceNumber,
      patient_name: validatedData.patientName,
      contact_person: validatedData.contactPerson,
      contact_number: validatedData.contactNumber,
      blood_group: validatedData.bloodGroup,
      units_required: validatedData.unitsRequired,
      hospital_name: validatedData.hospitalName,
      district: validatedData.district,
      hospital_location: validatedData.hospitalLocation,
      required_date: validatedData.requiredDate,
      urgency: validatedData.urgency,
      additional_info: validatedData.additionalInfo || null,
      status: 'new', // Public requests always start as 'new'
    };

    // 3. Insert into Supabase `blood_requests` table
    const { error } = await supabase.from('blood_requests').insert([payload]);

    if (error) {
      console.error('[bloodRequestService] Blood request insertion failed:', error);
      return {
        success: false,
        error:
          error.message ||
          'Failed to record blood request. Please call our 24/7 coordinator helpline directly.',
      };
    }

    return {
      success: true,
      referenceNumber,
      bloodGroup: validatedData.bloodGroup,
      district: validatedData.district,
      patientName: validatedData.patientName,
    };
  } catch (err) {
    console.error('[bloodRequestService] Unexpected submission error:', err);
    return {
      success: false,
      error: 'An unexpected connection error occurred. Please contact the coordinator helpline.',
    };
  }
}
