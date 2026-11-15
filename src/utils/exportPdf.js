import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Professional PDF Exporter for Blood Connect Kerala Donors
 * Generates an A4 Landscape document with clear typographic hierarchy,
 * red brand accents (#D92735), clean table borders, and page numbers.
 */
export function exportDonorsToPdf(donors = [], activeFilters = {}) {
  if (!donors || donors.length === 0) {
    alert('No donor records available to export.');
    return;
  }

  // 1. Initialize jsPDF in A4 Landscape
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // 2. Header Section
  // Brand Top Accent Bar
  doc.setFillColor(217, 39, 53); // #D92735
  doc.rect(14, 12, 4, 16, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(21, 21, 21); // #151515
  doc.text('BLOOD CONNECT KERALA', 22, 19);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(115, 115, 115);
  doc.text('Donor Registration Report', 22, 26);

  // Metadata block (Right side)
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated: ${todayStr}`, pageWidth - 14, 18, { align: 'right' });
  doc.text(`Total Records: ${donors.length}`, pageWidth - 14, 24, { align: 'right' });

  // 3. Active Filters Summary Bar (if any applied)
  const filterStrings = [];
  if (activeFilters.search) filterStrings.push(`Search: "${activeFilters.search}"`);
  if (activeFilters.bloodGroup && activeFilters.bloodGroup !== 'all')
    filterStrings.push(`Blood Group: ${activeFilters.bloodGroup}`);
  if (activeFilters.district && activeFilters.district !== 'all')
    filterStrings.push(`District: ${activeFilters.district}`);
  if (activeFilters.status && activeFilters.status !== 'all')
    filterStrings.push(`Status: ${activeFilters.status.toUpperCase()}`);

  let startY = 32;
  if (filterStrings.length > 0) {
    doc.setFillColor(245, 245, 245);
    doc.rect(14, 30, pageWidth - 28, 7, 'F');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`Filters: ${filterStrings.join('  •  ')}`, 17, 34.8);
    startY = 40;
  }

  // 4. Donor Table Data
  const tableData = donors.map((d) => [
    d.donor_code || 'BCK-0001',
    d.full_name || '—',
    d.phone || '—',
    d.blood_group || '—',
    d.age ? String(d.age) : '—',
    d.district || '—',
    (d.status || 'pending').toUpperCase(),
    d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : '—',
  ]);

  autoTable(doc, {
    startY,
    head: [['ID', 'Name', 'Mobile', 'Blood Group', 'Age', 'District', 'Status', 'Date']],
    body: tableData,
    theme: 'plain',
    showHead: 'everyPage',
    headStyles: {
      fillColor: [21, 21, 21], // #151515
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
      cellPadding: 3.5,
    },
    bodyStyles: {
      textColor: [30, 30, 30],
      fontSize: 8.5,
      cellPadding: 3,
      lineColor: [234, 234, 234],
      lineWidth: 0.15,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold' },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 35 },
      3: { cellWidth: 24, fontStyle: 'bold', textColor: [217, 39, 53] },
      4: { cellWidth: 16 },
      5: { cellWidth: 42 },
      6: { cellWidth: 28 },
      7: { cellWidth: 30 },
    },
    margin: { left: 14, right: 14, bottom: 16 },
    didDrawPage: () => {
      // Footer on every page
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      const totalPages = doc.internal.getNumberOfPages();

      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);

      // Left footer
      doc.text(
        'Blood Connect Kerala — Voluntary Blood Donor Network (Confidential Admin Document)',
        14,
        pageHeight - 8
      );

      // Right footer: Page numbers
      doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 14, pageHeight - 8, {
        align: 'right',
      });
    },
  });

  // 5. Download the PDF
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`blood-connect-donors-${dateStr}.pdf`);
}
