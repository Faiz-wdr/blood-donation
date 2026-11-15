/**
 * Native JavaScript CSV Exporter for Blood Connect Kerala Donors
 * Properly escapes commas, quotes, and newlines.
 */

export function exportDonorsToCsv(donors = []) {
  if (!donors || donors.length === 0) {
    alert('No donor records available to export.');
    return;
  }

  const headers = [
    'Donor ID',
    'Full Name',
    'Mobile Number',
    'Age',
    'Gender',
    'Blood Group',
    'District',
    'Local Body / Panchayat',
    'Location',
    'Willing to Donate',
    'Status',
    'Registration Date',
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = donors.map((d) => [
    escapeCsv(d.donor_code || 'BCK-0001'),
    escapeCsv(d.full_name),
    escapeCsv(d.phone),
    escapeCsv(d.age),
    escapeCsv(d.gender),
    escapeCsv(d.blood_group),
    escapeCsv(d.district),
    escapeCsv(d.local_body),
    escapeCsv(d.location),
    escapeCsv(d.willing_to_donate ? 'Yes' : 'No'),
    escapeCsv(d.status),
    escapeCsv(d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : ''),
  ]);

  const csvContent = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `blood-connect-donors-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
