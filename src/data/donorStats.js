/**
 * Phase 01: Temporary sample verified donor figures.
 * In Phase 02, this dataset will be dynamically fetched from Supabase:
 * const { data, error } = await supabase.from('donors').select('blood_group');
 */

export const SAMPLE_DONOR_COUNTS = [
  { group: 'A+', count: 428, note: 'Common Rh+' },
  { group: 'A-', count: 114, note: 'Rare Rh-' },
  { group: 'B+', count: 512, note: 'High Demand' },
  { group: 'B-', count: 96, note: 'Rare Rh-' },
  { group: 'O+', count: 684, note: 'Universal Red Cells' },
  { group: 'O-', count: 142, note: 'Emergency Universal' },
  { group: 'AB+', count: 320, note: 'Universal Plasma' },
  { group: 'AB-', count: 68, note: 'Critical Rarest' },
];

export const TOTAL_VERIFIED_DONORS = SAMPLE_DONOR_COUNTS.reduce(
  (sum, item) => sum + item.count,
  0
);

export const DONOR_METRICS = {
  totalCount: TOTAL_VERIFIED_DONORS,
  formattedTotal: `${TOTAL_VERIFIED_DONORS.toLocaleString('en-IN')}+`,
  label: 'Registered verified donors',
  disclaimer: 'Phase 01 sample verification counts. Real-time network telemetry connects with Supabase in Phase 02.',
};

