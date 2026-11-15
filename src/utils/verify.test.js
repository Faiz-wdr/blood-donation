import { KERALA_DISTRICTS } from '../data/districts.js';
import { BLOOD_GROUPS, STANDARD_BLOOD_GROUPS, RARE_BLOOD_GROUPS, ALL_BLOOD_GROUPS } from '../data/bloodGroups.js';
import { SAMPLE_DONOR_COUNTS, TOTAL_VERIFIED_DONORS, DONOR_METRICS } from '../data/donorStats.js';
import { buildWhatsAppRequestUrl } from './whatsapp.js';
import { donorRegistrationSchema, bloodRequestSchema } from './validation.js';
import { generateReferenceNumber } from '../services/bloodRequestService.js';
import { deleteDonor, updateDonorDetails, updateDonorStatus } from '../services/donorService.js';
import fs from 'fs';
import path from 'path';

console.log('--- RUNNING VERIFICATION SUITE FOR PHASE 01, 02 & 03 ---');

// 1. Check Kerala Districts
console.log('Testing Kerala Districts...');
if (KERALA_DISTRICTS.length !== 14) {
  throw new Error(`Expected 14 districts, got ${KERALA_DISTRICTS.length}`);
}
console.log('✓ All 14 Kerala districts validated.');

// 2. Check Blood Groups (8 Standard + 11 Rare = 19 Total)
console.log('Testing Blood Groups (8 Standard + 11 Rare = 19 Total)...');
const expectedStandard = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const expectedRare = [
  'A2B-', 'Oh (Bombay Blood Group)', 'Rh-null', 'Fy-a-b-', 'Jk-a-b-',
  'K0', 'Dia+', 'Lu-a-b-', 'Ina+', 'Vel-', 'Yt-a-b-'
];

if (STANDARD_BLOOD_GROUPS.length !== 8) {
  throw new Error(`Expected 8 standard blood groups, got ${STANDARD_BLOOD_GROUPS.length}`);
}
if (RARE_BLOOD_GROUPS.length !== 11) {
  throw new Error(`Expected 11 rare blood groups, got ${RARE_BLOOD_GROUPS.length}`);
}
if (BLOOD_GROUPS.length !== 19 || ALL_BLOOD_GROUPS.length !== 19) {
  throw new Error(`Expected 19 total blood groups, got ${BLOOD_GROUPS.length}`);
}
for (const bg of [...expectedStandard, ...expectedRare]) {
  if (!BLOOD_GROUPS.includes(bg)) {
    throw new Error(`Missing blood group: ${bg}`);
  }
}
console.log('✓ All 19 blood groups (8 standard, 11 rare) validated successfully.');

// 3. Check Donor Stats & Metrics
console.log('Testing Donor Stats structure...');
if (SAMPLE_DONOR_COUNTS.length !== 8 || TOTAL_VERIFIED_DONORS <= 0 || !DONOR_METRICS.label) {
  throw new Error('Donor stats structure invalid');
}
console.log('✓ Donor stats structure validated.');

// 4. Test WhatsApp URL Generation
console.log('Testing WhatsApp Click-to-Chat URL generator...');
const url1 = buildWhatsAppRequestUrl({ bloodGroup: 'O+', district: 'Ernakulam' });
if (!url1.includes('https://wa.me/919037305478?text=')) {
  throw new Error(`WhatsApp URL generated improperly: ${url1}`);
}
console.log('✓ WhatsApp URL generator validated.');

// 5. Test Zod Donor Registration Schema
console.log('Testing Donor Registration Zod Schema...');
const validDonor = {
  fullName: 'Arun Kumar',
  mobileNumber: '9847123456',
  age: '29',
  gender: 'Male',
  bloodGroup: 'B+',
  willingToDonate: 'Yes',
  district: 'Ernakulam',
  panchayat: 'Aluva',
  place: 'Companypady',
  consent: true,
};
const donorRes = donorRegistrationSchema.safeParse(validDonor);
if (!donorRes.success) {
  throw new Error(`Valid donor failed validation: ${JSON.stringify(donorRes.error.issues)}`);
}

const invalidDonorAge = { ...validDonor, age: 16 };
if (donorRegistrationSchema.safeParse(invalidDonorAge).success) {
  throw new Error('Donor validation allowed age < 18');
}

const invalidDonorConsent = { ...validDonor, consent: false };
if (donorRegistrationSchema.safeParse(invalidDonorConsent).success) {
  throw new Error('Donor validation allowed missing consent');
}
console.log('✓ Donor registration validation tests passed.');

// 6. Test Zod Blood Request Schema & Reference Number Generator
console.log('Testing Blood Request Zod Schema & Reference Generator...');
const refNum = generateReferenceNumber();
if (!refNum.startsWith('BCK-') || refNum.length < 15) {
  throw new Error(`Invalid reference number format: ${refNum}`);
}

const validRequest = {
  patientName: 'Karthik Menon',
  contactPerson: 'Suresh Menon',
  contactNumber: '9847654321',
  bloodGroup: 'O-',
  unitsRequired: '2',
  hospitalName: 'Lisie Hospital',
  district: 'Ernakulam',
  hospitalLocation: 'Kaloor',
  requiredDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  urgency: 'Emergency',
};
const reqRes = bloodRequestSchema.safeParse(validRequest);
if (!reqRes.success) {
  throw new Error(`Valid blood request failed validation: ${JSON.stringify(reqRes.error.issues)}`);
}

const invalidPhoneReq = { ...validRequest, contactNumber: '12345' };
if (bloodRequestSchema.safeParse(invalidPhoneReq).success) {
  throw new Error('Blood request validation allowed invalid phone number');
}
console.log('✓ Blood request validation & reference generator passed.');

// 6b. Verify Admin Donor Service Functions
console.log('Verifying Admin Donor Management Service functions...');
if (typeof deleteDonor !== 'function' || typeof updateDonorDetails !== 'function' || typeof updateDonorStatus !== 'function') {
  throw new Error('Admin donor management service functions missing!');
}
console.log('✓ deleteDonor, updateDonorDetails, and updateDonorStatus validated.');

// 7. Verify schema.sql and admin_migration.sql
console.log('Verifying SQL schemas for Phase 02 and Phase 03...');
const schemaPath = path.resolve('supabase/schema.sql');
const adminMigrationPath = path.resolve('supabase/admin_migration.sql');
if (!fs.existsSync(schemaPath) || !fs.existsSync(adminMigrationPath)) {
  throw new Error('Required SQL schema or migration file is missing!');
}
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const adminSql = fs.readFileSync(adminMigrationPath, 'utf8');

const requiredKeywords = [
  'CREATE TABLE IF NOT EXISTS public.donors',
  'CREATE TABLE IF NOT EXISTS public.blood_requests',
  'CREATE TABLE IF NOT EXISTS public.admin_users',
  'CREATE OR REPLACE FUNCTION public.is_admin',
  'CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats',
  'ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY',
  'SECURITY DEFINER',
];
for (const kw of requiredKeywords) {
  if (!schemaSql.includes(kw) && !adminSql.includes(kw)) {
    throw new Error(`SQL files missing required construct: ${kw}`);
  }
}
console.log('✓ Database schema, admin table, RLS, and security definer functions verified.');

// 8. Verify Netlify configuration
console.log('Verifying Netlify SPA routing redirects...');
const redirectsPath = path.resolve('public/_redirects');
if (!fs.existsSync(redirectsPath)) {
  throw new Error('public/_redirects file is missing!');
}
const redirectsContent = fs.readFileSync(redirectsPath, 'utf8').trim();
if (!redirectsContent.includes('/* /index.html 200')) {
  throw new Error(`public/_redirects content invalid: "${redirectsContent}"`);
}
console.log('✓ Netlify _redirects validated.');

// 9. Verify Admin Sidebar Strictly 2 items
console.log('Verifying Admin Sidebar navigation constraint (strictly 2 items: Dashboard, Donors)...');
const sidebarPath = path.resolve('src/components/admin/AdminSidebar.jsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
if (!sidebarContent.includes("'Dashboard'") || !sidebarContent.includes("'Donors'")) {
  throw new Error('Admin sidebar missing Dashboard or Donors nav item');
}
if (
  sidebarContent.includes('Analytics') ||
  sidebarContent.includes('Settings') ||
  sidebarContent.includes('Reports') ||
  sidebarContent.includes('Activity Logs') ||
  sidebarContent.includes('Blood Request Management')
) {
  throw new Error('BANNED: Unauthorized modules found in Admin Sidebar!');
}
console.log('✓ Admin Sidebar strictly restricted to Dashboard and Donors.');

// 10. Scan codebase for banned items: Lucide icons, emojis
console.log('Checking for strict compliance: NO lucide icons, NO emojis in UI code...');
const srcDir = path.resolve('src');

function getFiles(dir) {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = path.resolve(dir, subdir);
    return fs.statSync(res).isDirectory() ? getFiles(res) : res;
  });
  return files.reduce((a, f) => a.concat(f), []);
}

const allSrcFiles = getFiles(srcDir).filter((f) => f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.css'));
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;

for (const file of allSrcFiles) {
  if (file.endsWith('verify.test.js')) continue;
  const content = fs.readFileSync(file, 'utf8');

  if (content.toLowerCase().includes('lucide')) {
    throw new Error(`BANNED: Lucide reference found in ${file}`);
  }

  const emojiMatch = content.match(emojiRegex);
  if (emojiMatch) {
    throw new Error(`BANNED: Emoji "${emojiMatch[0]}" found in ${file}`);
  }
}
console.log('✓ Zero Lucide icons found.');
console.log('✓ Zero Emojis found across all source files.');

console.log('--- ALL PHASES 01, 02 & 03 VERIFICATION CHECKS PASSED SUCCESSFULLY ---');
