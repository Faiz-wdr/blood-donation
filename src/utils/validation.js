import { z } from 'zod';
import { BLOOD_GROUPS } from '../data/bloodGroups.js';
import { KERALA_DISTRICTS } from '../data/districts.js';

// Phone number regex: 10 digits starting with 6, 7, 8, or 9
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * Zod validation schema for Donor Registration
 */
export const donorRegistrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Full Name must be at least 2 characters' })
    .max(100, { message: 'Full Name cannot exceed 100 characters' }),
  mobileNumber: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ''))
    .refine((val) => INDIAN_PHONE_REGEX.test(val), {
      message: 'Enter a valid 10-digit mobile number starting with 6-9',
    }),
  age: z
    .coerce
    .number()
    .int({ message: 'Age must be a whole number' })
    .min(18, { message: 'Eligible donor age is between 18 and 65 years' })
    .max(65, { message: 'Eligible donor age is between 18 and 65 years' }),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid gender' }),
  }),
  bloodGroup: z.enum(BLOOD_GROUPS, {
    errorMap: () => ({ message: 'Please select a valid blood group' }),
  }),
  lastDonationDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const d = new Date(val);
        return !isNaN(d.getTime()) && d <= new Date();
      },
      { message: 'Last donation date cannot be in the future' }
    ),
  willingToDonate: z.enum(['Yes', 'Emergency Only', 'true', 'false'], {
    errorMap: () => ({ message: 'Please specify willingness to donate' }),
  }),
  district: z.enum(KERALA_DISTRICTS, {
    errorMap: () => ({ message: 'Please select a valid district from Kerala' }),
  }),
  panchayat: z
    .string()
    .trim()
    .min(2, { message: 'Panchayat or Municipality is required' })
    .max(100, { message: 'Location cannot exceed 100 characters' }),
  place: z
    .string()
    .trim()
    .min(2, { message: 'Place or locality is required' })
    .max(100, { message: 'Place cannot exceed 100 characters' }),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to share contact details for blood coordination' }),
  }),
});

/**
 * Zod validation schema for Emergency Blood Requests
 */
export const bloodRequestSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(2, { message: 'Patient name must be at least 2 characters' })
    .max(100, { message: 'Patient name cannot exceed 100 characters' }),
  contactPerson: z
    .string()
    .trim()
    .min(2, { message: 'Contact person name must be at least 2 characters' })
    .max(100, { message: 'Contact person name cannot exceed 100 characters' }),
  contactNumber: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ''))
    .refine((val) => INDIAN_PHONE_REGEX.test(val), {
      message: 'Enter a valid 10-digit contact mobile number',
    }),
  bloodGroup: z.enum(BLOOD_GROUPS, {
    errorMap: () => ({ message: 'Please select a required blood group' }),
  }),
  unitsRequired: z
    .coerce
    .number()
    .int({ message: 'Units required must be an integer' })
    .min(1, { message: 'Minimum 1 unit required' })
    .max(20, { message: 'For requests above 20 units, please contact state blood bank directly' }),
  hospitalName: z
    .string()
    .trim()
    .min(2, { message: 'Hospital name is required' })
    .max(150, { message: 'Hospital name cannot exceed 150 characters' }),
  district: z.enum(KERALA_DISTRICTS, {
    errorMap: () => ({ message: 'Please select a valid Kerala district' }),
  }),
  hospitalLocation: z
    .string()
    .trim()
    .min(2, { message: 'Hospital location / city is required' })
    .max(150, { message: 'Hospital location cannot exceed 150 characters' }),
  requiredDate: z
    .string()
    .refine(
      (val) => {
        if (!val) return false;
        const d = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(d.getTime()) && d >= today;
      },
      { message: 'Required date cannot be in the past' }
    ),
  urgency: z.enum(['Emergency', 'Within 24 Hours', 'Planned'], {
    errorMap: () => ({ message: 'Please select urgency level' }),
  }),
  additionalInfo: z
    .string()
    .max(500, { message: 'Additional info cannot exceed 500 characters' })
    .optional()
    .nullable(),
});
