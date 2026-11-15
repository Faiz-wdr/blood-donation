/**
 * Standard 8 ABO & Rh Blood Groups (Used on Landing/Hero Page)
 */
export const STANDARD_BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
];

/**
 * Rare & Ultra-Rare Blood Groups recognized by Blood Connect Kerala
 */
export const RARE_BLOOD_GROUPS = [
  'A2B-',
  'Oh (Bombay Blood Group)',
  'Rh-null',
  'Fy-a-b-',
  'Jk-a-b-',
  'K0',
  'Dia+',
  'Lu-a-b-',
  'Ina+',
  'Vel-',
  'Yt-a-b-',
];

/**
 * Complete list of all 19 blood groups accepted across Blood Connect Kerala
 */
export const ALL_BLOOD_GROUPS = [
  ...STANDARD_BLOOD_GROUPS,
  ...RARE_BLOOD_GROUPS,
];

/**
 * Default export: all 19 blood groups for registration, request forms, and directory
 */
export const BLOOD_GROUPS = ALL_BLOOD_GROUPS;
