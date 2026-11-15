import { useState, useEffect, useRef } from 'react';
import { fetchDonors, fetchDonorsForExport, deleteDonor } from '../../services/donorService';
import { exportDonorsToCsv } from '../../utils/exportCsv';
import { exportDonorsToPdf } from '../../utils/exportPdf';
import { BLOOD_GROUPS } from '../../data/bloodGroups';
import { KERALA_DISTRICTS } from '../../data/districts';
import DonorDetailModal from '../../components/admin/DonorDetailModal';
import CustomSelect from '../../components/ui/CustomSelect';
import LoaderOne from '../../components/ui/loader-one';
import useSEO from '../../hooks/useSEO';

/**
 * AdminDonorsPage:
 * Comprehensive donor management with search, multi-factor filtering,
 * pagination, inline status actions, edit/delete icon buttons, and single export popup.
 */
export default function AdminDonorsPage() {
  useSEO({
    title: 'Donors Management — Admin Portal | Blood Connect Kerala',
    description: 'Admin donor registry management for Blood Connect Kerala.',
    noindex: true,
  });

  const [donors, setDonors] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter states
  const [search, setSearch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('all');
  const [district, setDistrict] = useState('all');
  const [status, setStatus] = useState('all');

  // UI states
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalInitialEdit, setModalInitialEdit] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Design theme delete dialog & alert state
  const [donorToDelete, setDonorToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const exportMenuRef = useRef(null);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const reloadDonors = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  // Close export menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function execute() {
      const res = await fetchDonors({
        search,
        bloodGroup,
        district,
        status,
        page,
        pageSize,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      if (!ignore) {
        if (res.success) {
          setDonors(res.donors);
          setTotalCount(res.total);
          setTotalPages(res.totalPages);
        } else {
          setErrorMsg(res.error || 'Failed to retrieve donor records.');
        }
        setLoading(false);
      }
    }

    execute();
    return () => {
      ignore = true;
    };
  }, [search, bloodGroup, district, status, page, refreshKey]);

  // Handle filter changes (resets to page 1)
  const handleFilterChange = (setter) => (e) => {
    setLoading(true);
    setter(e.target.value);
    setPage(1);
  };

  const clearAllFilters = () => {
    setLoading(true);
    setSearch('');
    setBloodGroup('all');
    setDistrict('all');
    setStatus('all');
    setPage(1);
  };

  const hasActiveFilters = search || bloodGroup !== 'all' || district !== 'all' || status !== 'all';

  // Export handlers
  const handleExportCsv = async () => {
    setExporting(true);
    const res = await fetchDonorsForExport({ search, bloodGroup, district, status });
    if (res.success) {
      exportDonorsToCsv(res.donors);
    } else {
      setAlertMessage({ type: 'error', text: 'Export failed: ' + res.error });
    }
    setExporting(false);
  };

  const handleExportPdf = async () => {
    setExporting(true);
    const res = await fetchDonorsForExport({ search, bloodGroup, district, status });
    if (res.success) {
      exportDonorsToPdf(res.donors, { search, bloodGroup, district, status });
    } else {
      setAlertMessage({ type: 'error', text: 'Export failed: ' + res.error });
    }
    setExporting(false);
  };

  // Delete donor handler - opens design-theme modal
  const handleDeleteDonor = (donor) => {
    setDonorToDelete(donor);
  };

  // Confirm permanent deletion
  const confirmDeleteDonor = async () => {
    if (!donorToDelete) return;
    setDeletingId(donorToDelete.id);
    const donorName = donorToDelete.full_name;
    const res = await deleteDonor(donorToDelete.id);
    setDeletingId(null);
    setDonorToDelete(null);

    if (res.success) {
      setAlertMessage({
        type: 'success',
        text: `Donor "${donorName}" was permanently deleted.`,
      });
      reloadDonors();
    } else {
      setAlertMessage({
        type: 'error',
        text: res.error || 'Failed to delete donor. Please try again.',
      });
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'inactive':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Title & Single Export Button - Same row on mobile and desktop */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151515] tracking-tight">
            Donors
          </h1>
        </div>

        {/* Single Export Pop-up Menu */}
        <div className="relative" ref={exportMenuRef}>
          <button
            type="button"
            onClick={() => setShowExportMenu((prev) => !prev)}
            disabled={exporting || loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#151515] bg-white border border-[#EAEAEA] hover:border-[#CCCCCC] rounded-xl shadow-2xs hover:bg-[#FAFAFA] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 text-[#737373]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{exporting ? 'Exporting...' : 'Export'}</span>
            <svg
              className={`w-3.5 h-3.5 text-[#737373] transition-transform duration-150 ${
                showExportMenu ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EAEAEA] rounded-2xl shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(false);
                  handleExportPdf();
                }}
                disabled={exporting}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#151515] hover:bg-[#F5F5F5] hover:text-[#D92735] transition-colors cursor-pointer text-left"
              >
                <span>Export as PDF</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-50 text-[#D92735]">
                  PDF
                </span>
              </button>
              <div className="my-1 border-t border-[#EAEAEA]" />
              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(false);
                  handleExportCsv();
                }}
                disabled={exporting}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#151515] hover:bg-[#F5F5F5] hover:text-[#151515] transition-colors cursor-pointer text-left"
              >
                <span>Export as CSV</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#737373]">
                  CSV
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Bar without redundant labels */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID (e.g. BCK-0001), name, or phone..."
              value={search}
              onChange={handleFilterChange(setSearch)}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#F5F5F5] text-[#151515] placeholder:text-[#999999] rounded-xl border border-[#EAEAEA] outline-none focus:border-[#D92735] focus:bg-white transition-colors"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#737373]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* Blood Group Filter with custom design system tray */}
          <CustomSelect
            id="admin-filter-blood-group"
            name="blood-group"
            value={bloodGroup}
            onChange={handleFilterChange(setBloodGroup)}
            options={[
              { value: 'all', label: 'All Blood Groups' },
              ...BLOOD_GROUPS.map((g) => ({ value: g, label: g })),
            ]}
            placeholder="All Blood Groups"
            triggerClassName="w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 transition-all cursor-pointer"
          />

          {/* District Filter with custom design system tray */}
          <CustomSelect
            id="admin-filter-district"
            name="district"
            value={district}
            onChange={handleFilterChange(setDistrict)}
            options={[
              { value: 'all', label: 'All Districts (Kerala)' },
              ...KERALA_DISTRICTS.map((d) => ({ value: d, label: d })),
            ]}
            placeholder="All Districts (Kerala)"
            triggerClassName="w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 transition-all cursor-pointer"
          />

          {/* Status Filter with custom design system tray */}
          <CustomSelect
            id="admin-filter-status"
            name="status"
            value={status}
            onChange={handleFilterChange(setStatus)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'verified', label: 'Verified' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            placeholder="All Statuses"
            triggerClassName="w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 transition-all cursor-pointer"
          />
        </div>

        {/* Clear Filters Indicator */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
            <span className="text-[#737373]">
              Filtering applied • <span className="font-semibold text-[#151515]">{totalCount}</span> donors found
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[#D92735] hover:underline font-semibold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Donor Data Table */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <LoaderOne color="bg-[#D92735]" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#737373]">
              Loading Donors Database...
            </p>
          </div>
        ) : donors.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-base font-bold text-[#151515]">No donors found</p>
            <p className="text-xs text-[#737373]">
              {hasActiveFilters ? 'Try adjusting your search or filters.' : 'No donors registered yet.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-3 inline-block text-xs font-semibold text-[#D92735] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#EAEAEA] bg-[#FAFAFA] text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-3">Mobile</th>
                  <th className="py-3 px-2">Age</th>
                  <th className="py-3 px-2">Gender</th>
                  <th className="py-3 px-3">Blood Group</th>
                  <th className="py-3 px-3">District</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Registered</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {donors.map((donor) => (
                  <tr
                    key={donor.id}
                    onClick={() => {
                      setSelectedDonor(donor);
                      setModalInitialEdit(false);
                    }}
                    className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#151515]">{donor.full_name}</div>
                      <div className="text-[11px] font-mono font-medium text-[#737373]">
                        {donor.donor_code || 'BCK-0001'}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-[#555555]">
                      {donor.phone}
                    </td>
                    <td className="py-3.5 px-2 text-[#666666]">
                      {donor.age}
                    </td>
                    <td className="py-3.5 px-2 text-[#666666]">
                      {donor.gender}
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-[#D92735]">
                      {donor.blood_group}
                    </td>
                    <td className="py-3.5 px-3 text-[#666666]">
                      {donor.district}
                    </td>
                    <td className="py-3.5 px-3 text-[#737373] truncate max-w-[120px]">
                      {donor.location || donor.local_body}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          donor.status
                        )}`}
                      >
                        {donor.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#737373]">
                      {new Date(donor.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Edit Icon Button */}
                        <button
                          type="button"
                          title="Edit donor"
                          aria-label={`Edit ${donor.full_name}`}
                          onClick={() => {
                            setSelectedDonor(donor);
                            setModalInitialEdit(true);
                          }}
                          className="p-1.5 rounded-lg text-[#737373] hover:text-[#151515] hover:bg-[#EAEAEA] transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* Delete Icon Button */}
                        <button
                          type="button"
                          title="Delete donor"
                          aria-label={`Delete ${donor.full_name}`}
                          onClick={() => handleDeleteDonor(donor)}
                          className="p-1.5 rounded-lg text-[#737373] hover:text-[#D92735] hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar with Icon Buttons */}
        {!loading && donors.length > 0 && (
          <div className="p-4 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
            <p>
              Showing <span className="font-semibold text-[#151515]">{(page - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-[#151515]">
                {Math.min(page * pageSize, totalCount)}
              </span>{' '}
              {totalCount > pageSize && (
                <>
                  of <span className="font-semibold text-[#151515]">{totalCount}</span>{' '}
                </>
              )}
              donors
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={`p-2 rounded-xl border transition-colors ${
                  page <= 1
                    ? 'border-[#EAEAEA] text-[#CCCCCC] cursor-not-allowed bg-[#FAFAFA]'
                    : 'border-[#EAEAEA] text-[#151515] hover:bg-[#F5F5F5] hover:border-[#CCCCCC] cursor-pointer'
                }`}
                aria-label="Previous Page"
                title="Previous Page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="px-2 text-xs font-semibold text-[#151515]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className={`p-2 rounded-xl border transition-colors ${
                  page >= totalPages
                    ? 'border-[#EAEAEA] text-[#CCCCCC] cursor-not-allowed bg-[#FAFAFA]'
                    : 'border-[#EAEAEA] text-[#151515] hover:bg-[#F5F5F5] hover:border-[#CCCCCC] cursor-pointer'
                }`}
                aria-label="Next Page"
                title="Next Page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Donor Detail & Action Modal */}
      {selectedDonor && (
        <DonorDetailModal
          donor={selectedDonor}
          initialEdit={modalInitialEdit}
          onClose={() => {
            setSelectedDonor(null);
            setModalInitialEdit(false);
          }}
          onUpdated={reloadDonors}
        />
      )}

      {/* Toast Alert Notification in Design Theme */}
      {alertMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full animate-fade-in pointer-events-auto">
          <div
            className={`p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-3 ${
              alertMessage.type === 'success'
                ? 'bg-white border-emerald-300 text-emerald-900 shadow-emerald-500/10'
                : 'bg-white border-red-300 text-red-900 shadow-red-500/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  alertMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-[#D92735]'
                }`}
              >
                {alertMessage.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold">{alertMessage.text}</p>
            </div>
            <button
              type="button"
              onClick={() => setAlertMessage(null)}
              className="text-[#737373] hover:text-[#151515] p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal in Design Theme */}
      {donorToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-fade-in"
          onClick={() => {
            if (!deletingId) setDonorToDelete(null);
          }}
        >
          <div
            className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-black/10 text-center animate-in fade-in zoom-in-95 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Red Theme Icon Badge */}
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-[#D92735] border border-red-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="text-xl font-extrabold text-[#151515] tracking-tight">
              Delete Donor Permanently?
            </h3>
            <p className="mt-1 text-xs text-[#737373] font-malayalam font-semibold">
              ദാതാവിന്റെ വിവരങ്ങൾ പൂർണ്ണമായി നീക്കം ചെയ്യും
            </p>

            <p className="mt-3 text-xs sm:text-sm text-[#666666] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#151515]">{donorToDelete.full_name}</strong> from the registry? This action is permanent and cannot be undone.
            </p>

            {/* Donor Quick Details Card */}
            <div className="mt-4 p-3.5 bg-[#F5F5F5] rounded-2xl border border-[#EAEAEA] text-left text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[#737373]">Blood Group:</span>
                <span className="font-bold text-[#D92735]">{donorToDelete.blood_group}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737373]">District:</span>
                <span className="font-semibold text-[#151515]">{donorToDelete.district}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737373]">Phone:</span>
                <span className="font-mono text-[#151515]">{donorToDelete.phone}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setDonorToDelete(null)}
                className="flex-1 py-3 px-5 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#151515] text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={confirmDeleteDonor}
                className="flex-1 py-3 px-5 rounded-full bg-[#D92735] hover:bg-[#B81E2B] active:bg-[#9B1723] text-white text-sm font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
