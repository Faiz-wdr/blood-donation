import { useState } from 'react';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import Button from '../ui/Button';
import { BLOOD_GROUPS } from '../../data/bloodGroups';
import { KERALA_DISTRICTS } from '../../data/districts';
import { submitBloodRequest } from '../../services/bloodRequestService';

/**
 * BloodRequestForm:
 * Mobile-first emergency blood requirement request form.
 * Directly inserts into the Supabase `blood_requests` table with auto-generated reference number.
 */
export default function BloodRequestForm({
  initialBloodGroup = '',
  initialDistrict = '',
  onClose,
}) {
  const getInitialDate = () => {
    return new Date().toISOString().slice(0, 10);
  };

  const initialFormData = {
    patientName: '',
    contactPerson: '',
    contactNumber: '',
    bloodGroup: initialBloodGroup || '',
    unitsRequired: 1,
    hospitalName: '',
    district: initialDistrict && initialDistrict !== 'All Districts' ? initialDistrict : '',
    hospitalLocation: '',
    requiredDate: getInitialDate(),
    urgency: 'Emergency',
    additionalInfo: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  const urgencyOptions = [
    { value: 'Emergency', label: 'Emergency (Immediate)' },
    { value: 'Within 24 Hours', label: 'Within 24 Hours' },
    { value: 'Planned', label: 'Planned / Scheduled' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (submitError) setSubmitError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.contactNumber.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.contactNumber = 'Contact mobile number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.contactNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Please select the required blood group';
    }

    const units = parseInt(formData.unitsRequired, 10);
    if (!formData.unitsRequired || isNaN(units) || units < 1) {
      newErrors.unitsRequired = 'Minimum 1 unit required';
    } else if (units > 20) {
      newErrors.unitsRequired = 'Maximum 20 units per request';
    }

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    if (!formData.district) {
      newErrors.district = 'Please select the district';
    }

    if (!formData.hospitalLocation.trim()) {
      newErrors.hospitalLocation = 'Hospital city / location is required';
    }

    if (!formData.requiredDate) {
      newErrors.requiredDate = 'Required date is required';
    } else {
      const selected = new Date(formData.requiredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.requiredDate = 'Required date cannot be in the past';
      }
    }

    if (!formData.urgency) {
      newErrors.urgency = 'Please select urgency level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const errorEl = document.getElementById(`req-${firstErrorKey}`);
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitBloodRequest(formData);

      if (result.success) {
        setSubmissionResult(result);
      } else {
        setSubmitError(result.error || 'Failed to submit blood request.');
      }
    } catch (err) {
      console.error('[BloodRequestForm] Error:', err);
      setSubmitError('An unexpected connection error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError('');
    setSubmissionResult(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {submissionResult ? (
        /* Section 6 Success State */
        <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-black/[0.04] animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#151515] tracking-tight">
            Your blood request has been submitted successfully.
          </h3>

          <p className="mt-2 text-base font-malayalam text-[#151515]">
            രക്തത്തിനായുള്ള അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു.
          </p>

          {/* Reference Number & Summary Box */}
          <div className="mt-6 p-5 rounded-2xl bg-[#F5F5F5] border border-[#EAEAEA] text-left space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0]">
              <span className="text-xs uppercase tracking-wider text-[#737373] font-bold">
                Reference Number
              </span>
              <span className="font-mono text-sm sm:text-base font-extrabold text-[#D92735] px-2.5 py-0.5 rounded-md bg-[#D92735]/10">
                {submissionResult.referenceNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs sm:text-sm">
              <div>
                <span className="text-[#737373]">Blood Group:</span>{' '}
                <span className="font-bold text-[#151515]">{submissionResult.bloodGroup}</span>
              </div>
              <div>
                <span className="text-[#737373]">District:</span>{' '}
                <span className="font-bold text-[#151515]">{submissionResult.district}</span>
              </div>
            </div>

            <p className="pt-2 text-xs text-[#666666] leading-relaxed">
              Our voluntary coordination team will review the request and initiate donor outreach across verified networks. Please keep your contact phone active.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
            >
              Submit Another Request
            </Button>
            {onClose && (
              <Button
                type="button"
                onClick={onClose}
                variant="dark"
                size="md"
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Emergency Request Form */
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-9 shadow-xl shadow-black/[0.05] animate-fade-in"
        >
          {/* Header */}
          <div className="pb-5 mb-7 border-b border-[#EAEAEA] flex items-start justify-between">
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#151515] tracking-tight">
                Emergency Blood Request
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] font-malayalam mt-0.5">
                അടിയന്തര രക്ത ആവശ്യകത ഫോം
              </p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-[#737373] hover:text-[#151515] px-2.5 py-1 rounded-lg hover:bg-[#F5F5F5] transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>

          {submitError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-start gap-2.5">
              <svg className="w-5 h-5 shrink-0 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Patient & Contact Information */}
            <div className="space-y-4">
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#151515]">
                  1. Patient & Contact Information
                </h4>
                <p className="text-xs text-[#737373] font-malayalam mt-0.5">
                  രോഗിയുടെയും ബന്ധപ്പെടേണ്ട ആളുടെയും വിവരങ്ങൾ
                </p>
              </div>

              <FormInput
                id="req-patientName"
                name="patientName"
                label="Patient Name"
                labelMl="രോഗിയുടെ പേര്"
                placeholder="Enter patient's name"
                value={formData.patientName}
                onChange={handleChange}
                error={errors.patientName}
                disabled={submitting}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  id="req-contactPerson"
                  name="contactPerson"
                  label="Contact Person"
                  labelMl="ബന്ധപ്പെടേണ്ട വ്യക്തി"
                  placeholder="Bystander / relative name"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  error={errors.contactPerson}
                  disabled={submitting}
                  required
                />

                <FormInput
                  id="req-contactNumber"
                  name="contactNumber"
                  type="tel"
                  label="Contact Phone"
                  labelMl="ഫോൺ നമ്പർ"
                  placeholder="10-digit mobile"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  error={errors.contactNumber}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Blood Requirement Details */}
            <div className="space-y-4 pt-5 border-t border-[#EAEAEA]">
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#151515]">
                  2. Blood Details & Urgency
                </h4>
                <p className="text-xs text-[#737373] font-malayalam mt-0.5">
                  ആവശ്യമായ രക്തഗ്രൂപ്പും സമയപരിധിയും
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  id="req-bloodGroup"
                  name="bloodGroup"
                  label="Required Blood Group"
                  labelMl="രക്തഗ്രൂപ്പ്"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  options={BLOOD_GROUPS}
                  placeholder="Select blood group"
                  error={errors.bloodGroup}
                  disabled={submitting}
                  required
                />

                <FormInput
                  id="req-unitsRequired"
                  name="unitsRequired"
                  type="number"
                  min="1"
                  max="20"
                  label="Units Required"
                  labelMl="ആവശ്യമായ യൂണിറ്റ്"
                  placeholder="e.g. 1"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  error={errors.unitsRequired}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  id="req-requiredDate"
                  name="requiredDate"
                  type="date"
                  label="Required Date"
                  labelMl="ആവശ്യമായ തീയതി"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  error={errors.requiredDate}
                  disabled={submitting}
                  required
                />

                <FormSelect
                  id="req-urgency"
                  name="urgency"
                  label="Urgency Level"
                  labelMl="അടിയന്തര സ്വഭാവം"
                  value={formData.urgency}
                  onChange={handleChange}
                  options={urgencyOptions}
                  error={errors.urgency}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Hospital & Location */}
            <div className="space-y-4 pt-5 border-t border-[#EAEAEA]">
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#151515]">
                  3. Hospital & Location
                </h4>
                <p className="text-xs text-[#737373] font-malayalam mt-0.5">
                  ആശുപത്രി വിവരങ്ങൾ
                </p>
              </div>

              <FormInput
                id="req-hospitalName"
                name="hospitalName"
                label="Hospital Name"
                labelMl="ആശുപത്രിയുടെ പേര്"
                placeholder="e.g. Medical College, Aster Medcity"
                value={formData.hospitalName}
                onChange={handleChange}
                error={errors.hospitalName}
                disabled={submitting}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  id="req-district"
                  name="district"
                  label="District"
                  labelMl="ജില്ല"
                  value={formData.district}
                  onChange={handleChange}
                  options={KERALA_DISTRICTS}
                  placeholder="Select District"
                  error={errors.district}
                  disabled={submitting}
                  required
                />

                <FormInput
                  id="req-hospitalLocation"
                  name="hospitalLocation"
                  label="Hospital Location"
                  labelMl="സ്ഥലം"
                  placeholder="e.g. Cheranalloor, Aluva"
                  value={formData.hospitalLocation}
                  onChange={handleChange}
                  error={errors.hospitalLocation}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="text-left">
                <label
                  htmlFor="req-additionalInfo"
                  className="block text-sm font-semibold text-[#151515] mb-1"
                >
                  Additional Information (Optional)
                  <span className="block text-xs text-[#737373] font-malayalam mt-0.5">
                    മറ്റ് പ്രത്യേക വിവരങ്ങൾ (ആവശ്യമെങ്കിൽ)
                  </span>
                </label>
                <textarea
                  id="req-additionalInfo"
                  name="additionalInfo"
                  rows={3}
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Any specific instructions, replacement donor details, or ward number..."
                  className="w-full px-4 py-3 text-sm bg-[#F5F5F5] text-[#151515] placeholder:text-[#999999] rounded-2xl border border-[#EAEAEA] hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full justify-center text-base font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Request to Supabase...</span>
                  </span>
                ) : (
                  <>
                    <span>Submit Blood Request</span>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-[#737373]">
                Emergency Coordination • Free Voluntary Initiative • Verified by Coordinators
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

