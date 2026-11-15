import { useState } from 'react';
import { updateDonorStatus, updateDonorDetails } from '../../services/donorService';
import { BLOOD_GROUPS } from '../../data/bloodGroups';
import { KERALA_DISTRICTS } from '../../data/districts';
import Button from '../ui/Button';
import CustomSelect from '../ui/CustomSelect';

/**
 * DonorDetailModal:
 * Displays complete donor profile details and allows authorized status changes
 * (Verify, Reject, Deactivate, Activate) and in-place field corrections.
 */
export default function DonorDetailModal({ donor, onClose, onUpdated, initialEdit = false }) {
  const [currentDonor, setCurrentDonor] = useState(donor);
  const [isEditing, setIsEditing] = useState(initialEdit);
  const [editForm, setEditForm] = useState({
    full_name: donor.full_name || '',
    phone: donor.phone || '',
    age: donor.age || '',
    gender: donor.gender || 'Male',
    blood_group: donor.blood_group || 'O+',
    district: donor.district || 'Ernakulam',
    local_body: donor.local_body || '',
    location: donor.location || '',
  });

  const [confirmAction, setConfirmAction] = useState(null); // { status, label }
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleStatusChange = async (newStatus) => {
    setLoadingAction(true);
    setActionError('');

    const res = await updateDonorStatus(currentDonor.id, newStatus);
    if (res.success) {
      setCurrentDonor(res.donor);
      setConfirmAction(null);
      if (onUpdated) onUpdated(res.donor);
    } else {
      setActionError(res.error || 'Failed to update donor status.');
    }
    setLoadingAction(false);
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setActionError('');

    const payload = {
      full_name: editForm.full_name.trim(),
      phone: editForm.phone.trim(),
      age: parseInt(editForm.age, 10),
      gender: editForm.gender,
      blood_group: editForm.blood_group,
      district: editForm.district,
      local_body: editForm.local_body.trim(),
      location: editForm.location.trim(),
    };

    const res = await updateDonorDetails(currentDonor.id, payload);
    if (res.success) {
      setCurrentDonor(res.donor);
      setIsEditing(false);
      if (onUpdated) onUpdated(res.donor);
    } else {
      setActionError(res.error || 'Failed to save donor details.');
    }
    setLoadingAction(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 py-8 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-left">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#EAEAEA]">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#151515] tracking-tight">
                {currentDonor.full_name}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(
                  currentDonor.status
                )}`}
              >
                {currentDonor.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#737373]">
              Registered ID: <span className="font-mono font-bold text-[#151515]">{currentDonor.donor_code || currentDonor.id}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close modal"
            aria-label="Close modal"
            className="p-2 rounded-xl text-[#737373] hover:text-[#151515] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-medium">
            {actionError}
          </div>
        )}

        {/* Status Confirmation Prompt Dialog */}
        {confirmAction && (
          <div className="mt-4 p-4 rounded-2xl bg-[#F5F5F5] border border-[#D4D4D4] animate-fade-in">
            <p className="text-sm font-semibold text-[#151515]">
              Confirm Action: Change status to <span className="uppercase text-[#D92735]">{confirmAction.status}</span>?
            </p>
            <p className="mt-1 text-xs text-[#666666]">
              {confirmAction.status === 'verified'
                ? 'This donor will immediately be counted as an active verified donor across public statistics.'
                : confirmAction.status === 'rejected'
                ? 'This donor record will be flagged as rejected and excluded from emergency searches.'
                : 'This will update the donor verification status in the database.'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={loadingAction}
                onClick={() => handleStatusChange(confirmAction.status)}
              >
                {loadingAction ? 'Updating...' : `Confirm ${confirmAction.label}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loadingAction}
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Main Content: Edit Mode OR View Mode */}
        {isEditing ? (
          <form onSubmit={handleSaveDetails} className="mt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515] border-b pb-2">
              Edit Donor Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none focus:border-[#D92735]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none focus:border-[#D92735]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  required
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none focus:border-[#D92735]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1">
                  Gender
                </label>
                <CustomSelect
                  id="edit-donor-gender"
                  name="gender"
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  options={['Male', 'Female', 'Other']}
                  placeholder="Select gender"
                  triggerClassName="w-full flex items-center justify-between px-3 py-2 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1">
                  Blood Group
                </label>
                <CustomSelect
                  id="edit-donor-blood-group"
                  name="blood_group"
                  value={editForm.blood_group}
                  onChange={(e) => setEditForm({ ...editForm, blood_group: e.target.value })}
                  options={BLOOD_GROUPS}
                  placeholder="Select blood group"
                  triggerClassName="w-full flex items-center justify-between px-3 py-2 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1">
                  District
                </label>
                <CustomSelect
                  id="edit-donor-district"
                  name="district"
                  value={editForm.district}
                  onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                  options={KERALA_DISTRICTS}
                  placeholder="Select district"
                  triggerClassName="w-full flex items-center justify-between px-3 py-2 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1">
                  Panchayat / Municipality
                </label>
                <input
                  type="text"
                  required
                  value={editForm.local_body}
                  onChange={(e) => setEditForm({ ...editForm, local_body: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none focus:border-[#D92735]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1">
                  Place / Locality
                </label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#F5F5F5] text-[#151515] rounded-xl border border-[#EAEAEA] outline-none focus:border-[#D92735]"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EAEAEA]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={loadingAction}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={loadingAction}
              >
                {loadingAction ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="mt-6 space-y-6">
            {/* 1. Personal & Blood Details Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515] mb-3">
                1. Personal & Blood Details
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9F9F9] p-4 rounded-2xl border border-[#EAEAEA] text-xs sm:text-sm">
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Blood Group</span>
                  <span className="font-extrabold text-base text-[#D92735]">
                    {currentDonor.blood_group}
                  </span>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Mobile</span>
                  <a
                    href={`tel:${currentDonor.phone}`}
                    className="font-semibold text-[#151515] hover:text-[#D92735] underline"
                  >
                    {currentDonor.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Age</span>
                  <span className="font-semibold text-[#151515]">{currentDonor.age} years</span>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Gender</span>
                  <span className="font-semibold text-[#151515]">{currentDonor.gender}</span>
                </div>
              </div>
            </div>

            {/* 2. Location & Availability */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515] mb-3">
                2. Location & Availability
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F9F9F9] p-4 rounded-2xl border border-[#EAEAEA] text-xs sm:text-sm">
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">District</span>
                  <span className="font-semibold text-[#151515]">{currentDonor.district}</span>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Local Body</span>
                  <span className="font-semibold text-[#151515]">{currentDonor.local_body}</span>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Place</span>
                  <span className="font-semibold text-[#151515]">{currentDonor.location}</span>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Willing to Donate</span>
                  <span className="font-semibold text-emerald-700">
                    {currentDonor.willing_to_donate ? 'Yes (Active)' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Last Donation Date</span>
                  <span className="font-semibold text-[#151515]">
                    {currentDonor.last_donation_date || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[#737373] block text-[11px] uppercase">Registered On</span>
                  <span className="font-semibold text-[#151515]">
                    {new Date(currentDonor.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Status Action Toolbar */}
            <div className="pt-4 border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {currentDonor.status !== 'verified' && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setConfirmAction({ status: 'verified', label: 'Verify' })}
                  >
                    Verify Donor
                  </Button>
                )}

                {currentDonor.status !== 'rejected' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-700 hover:bg-red-50"
                    onClick={() => setConfirmAction({ status: 'rejected', label: 'Reject' })}
                  >
                    Reject
                  </Button>
                )}

                {currentDonor.status === 'verified' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmAction({ status: 'inactive', label: 'Deactivate' })}
                  >
                    Mark Inactive
                  </Button>
                )}

                {currentDonor.status === 'inactive' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmAction({ status: 'verified', label: 'Activate' })}
                  >
                    Reactivate Donor
                  </Button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Edit donor details"
                aria-label="Edit donor details"
                className="p-2 rounded-xl border border-[#EAEAEA] text-[#737373] hover:text-[#151515] hover:bg-[#F5F5F5] hover:border-[#CCCCCC] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

