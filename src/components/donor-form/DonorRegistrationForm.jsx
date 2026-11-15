import { useState } from 'react';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import Button from '../ui/Button';
import { BLOOD_GROUPS } from '../../data/bloodGroups';
import { KERALA_DISTRICTS } from '../../data/districts';
import { registerDonor } from '../../services/donorService';

/**
 * DonorRegistrationForm:
 * Phase 02 Supabase Integration with Zod validation.
 * Features mobile-first layout, English & Malayalam labels (Google Font Manjari, no slashes),
 * double-submission prevention, and real database insertion into the `donors` table.
 */
export default function DonorRegistrationForm({ onCancel }) {
  const initialFormData = {
    fullName: '',
    mobileNumber: '',
    age: '',
    gender: '',
    bloodGroup: '',
    lastDonationDate: '',
    willingToDonate: 'Yes',
    district: '',
    panchayat: '',
    place: '',
    consent: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const genderOptions = [
    { value: 'Male', label: 'Male (പുരുഷൻ)' },
    { value: 'Female', label: 'Female (സ്ത്രീ)' },
    { value: 'Other', label: 'Other (മറ്റുള്ളവ)' },
  ];

  const willingnessOptions = [
    { value: 'Yes', label: 'Yes, actively available (അതെ)' },
    { value: 'Emergency Only', label: 'Emergency situations only (അത്യാഹിത ഘട്ടങ്ങളിൽ മാത്രം)' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
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

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required / പൂർണ്ണമായ പേര് നൽകുക';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter at least 2 characters';
    }

    // Mobile Number (10 digits Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.mobileNumber.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.mobileNumber = 'Mobile number is required / മൊബൈൽ നമ്പർ നൽകുക';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number (e.g. 9876543210)';
    }

    // Age (18 to 65 standard donor eligibility)
    const ageNum = parseInt(formData.age, 10);
    if (!formData.age) {
      newErrors.age = 'Age is required / വയസ്സ് നൽകുക';
    } else if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      newErrors.age = 'Eligible donor age is between 18 and 65 years';
    }

    // Gender
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender / ലിംഗം തിരഞ്ഞെടുക്കുക';
    }

    // Blood Group
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Please select your blood group / രക്തഗ്രൂപ്പ് തിരഞ്ഞെടുക്കുക';
    }

    // Last donation date (optional, but cannot be future date)
    if (formData.lastDonationDate) {
      const selectedDate = new Date(formData.lastDonationDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.lastDonationDate = 'Last donation date cannot be in the future';
      }
    }

    // Willing to donate
    if (!formData.willingToDonate) {
      newErrors.willingToDonate = 'Please select your willingness status';
    }

    // District
    if (!formData.district) {
      newErrors.district = 'Please select your district / ജില്ല തിരഞ്ഞെടുക്കുക';
    }

    // Panchayat / Municipality
    if (!formData.panchayat.trim()) {
      newErrors.panchayat = 'Panchayat or Municipality is required / തദ്ദേശ സ്ഥാപനം നൽകുക';
    }

    // Place
    if (!formData.place.trim()) {
      newErrors.place = 'Place / locality is required / സ്ഥലം നൽകുക';
    }

    // Consent
    if (!formData.consent) {
      newErrors.consent = 'You must agree to share contact details for blood coordination';
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
        const errorEl = document.getElementById(firstErrorKey);
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setSubmitting(true);

    try {
      // Direct insertion into Supabase donors table with status = 'pending'
      const result = await registerDonor(formData);

      if (result.success) {
        setSubmittedName(formData.fullName);
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('[DonorRegistrationForm] Error:', err);
      setSubmitError('An unexpected error occurred. Please verify your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError('');
    setIsSubmitted(false);
  };

  return (
    <div id="donor-registration-form" className="w-full max-w-xl mx-auto scroll-mt-24">
      {isSubmitted ? (
        /* Confirmed Supabase Success State */
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
            Registration submitted successfully.
          </h3>

          <p className="mt-2 text-base font-malayalam text-[#151515]">
            രജിസ്ട്രേഷൻ വിജയകരമായി സമർപ്പിച്ചു.
          </p>

          <p className="mt-4 text-sm sm:text-base text-[#666666] leading-relaxed max-w-md mx-auto">
            Thank you, <span className="font-semibold text-[#151515]">{submittedName}</span>, for joining Blood Connect Kerala. Your registration is pending review by our coordinator team.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-[#F5F5F5] border border-[#EAEAEA] text-left text-xs sm:text-sm text-[#737373] space-y-1">
            <p className="font-semibold text-[#151515]">Status: Pending Review</p>
            <p>Our volunteer team will verify your contact details before listing your availability for emergency patient requests.</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
            >
              Register Another Donor
            </Button>
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="ghost"
                size="md"
                className="w-full sm:w-auto"
              >
                Close Form
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Mobile-First Donor Registration Form */
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-9 shadow-xl shadow-black/[0.05] animate-fade-in"
        >
          {onCancel && (
            <div className="pb-4 mb-4 flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-semibold text-[#737373] hover:text-[#151515] px-2.5 py-1 rounded-lg hover:bg-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Submission error banner */}
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

          <div className="space-y-7">
            {/* 1. Personal Details */}
            <div className="space-y-4">
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#151515]">
                  1. Personal Details
                </h4>
                <p className="text-xs text-[#737373] font-malayalam mt-0.5">
                  വ്യക്തിഗത വിവരങ്ങൾ
                </p>
              </div>

              <FormInput
                id="fullName"
                name="fullName"
                label="Full Name"
                labelMl="പൂർണ്ണമായ പേര്"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                disabled={submitting}
                required
              />

              <FormInput
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                label="Mobile Number"
                labelMl="മൊബൈൽ നമ്പർ"
                placeholder="10-digit mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                error={errors.mobileNumber}
                disabled={submitting}
                required
                helperText="We will contact you only for voluntary blood requests"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="65"
                  label="Age"
                  labelMl="വയസ്സ്"
                  placeholder="18 - 65"
                  value={formData.age}
                  onChange={handleChange}
                  error={errors.age}
                  disabled={submitting}
                  required
                />

                <FormSelect
                  id="gender"
                  name="gender"
                  label="Gender"
                  labelMl="ലിംഗം"
                  value={formData.gender}
                  onChange={handleChange}
                  options={genderOptions}
                  placeholder="Select gender"
                  error={errors.gender}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* 2. Blood Details */}
            <div className="space-y-4 pt-5 border-t border-[#EAEAEA]">
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#151515]">
                  2. Blood Details
                </h4>
                <p className="text-xs text-[#737373] font-malayalam mt-0.5">
                  രക്ത വിവരങ്ങൾ
                </p>
              </div>

              <FormSelect
                id="bloodGroup"
                name="bloodGroup"
                label="Blood Group"
                labelMl="രക്തഗ്രൂപ്പ്"
                value={formData.bloodGroup}
                onChange={handleChange}
                options={BLOOD_GROUPS}
                placeholder="Select your blood group"
                error={errors.bloodGroup}
                disabled={submitting}
                required
              />

              <FormInput
                id="lastDonationDate"
                name="lastDonationDate"
                type="date"
                label="Last Donation Date"
                labelMl="അവസാനമായി രക്തം നൽകിയ തീയതി"
                value={formData.lastDonationDate}
                onChange={handleChange}
                error={errors.lastDonationDate}
                disabled={submitting}
                helperText="Optional — leave blank if first-time donor"
              />

              <FormSelect
                id="willingToDonate"
                name="willingToDonate"
                label="Willing to Donate"
                labelMl="രക്തം ദാനം ചെയ്യാൻ തയ്യാറാണോ?"
                value={formData.willingToDonate}
                onChange={handleChange}
                options={willingnessOptions}
                error={errors.willingToDonate}
                disabled={submitting}
                required
              />
            </div>

            {/* 3. Location */}
            <div className="space-y-4 pt-5 border-t border-[#EAEAEA]">
              <div className="text-left py-0.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#151515]">
                  3. Location
                </h4>
                <p className="text-xs text-[#737373] font-malayalam mt-0.5">
                  ലൊക്കേഷൻ
                </p>
              </div>

              <FormSelect
                id="district"
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
                id="panchayat"
                name="panchayat"
                label="Panchayat or Municipality"
                labelMl="പഞ്ചായത്ത് അല്ലെങ്കിൽ മുനിസിപ്പാലിറ്റി"
                placeholder="e.g. Aluva, Varkala"
                value={formData.panchayat}
                onChange={handleChange}
                error={errors.panchayat}
                disabled={submitting}
                required
              />

              <FormInput
                id="place"
                name="place"
                label="Place"
                labelMl="സ്ഥലം"
                placeholder="e.g. Edappally, Kazhakkoottam"
                value={formData.place}
                onChange={handleChange}
                error={errors.place}
                disabled={submitting}
                required
              />
            </div>

            {/* 4. Consent */}
            <div className="pt-5 border-t border-[#EAEAEA]">
              <div className="flex items-start gap-3 text-left">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleChange}
                  disabled={submitting}
                  className="mt-1 h-5 w-5 rounded-md border-[#EAEAEA] text-[#D92735] focus:ring-[#D92735] cursor-pointer"
                />
                <label
                  htmlFor="consent"
                  className="text-xs sm:text-sm text-[#151515] leading-relaxed cursor-pointer select-none"
                >
                  <span>
                    I agree to share my contact details with authorized Blood Connect Kerala coordinators for blood donation coordination.
                  </span>
                  <span className="text-[#D92735] font-bold ml-1">*</span>
                  <span className="block text-xs text-[#737373] font-malayalam mt-0.5">
                    രക്തദാന ഏകോപനത്തിനായി രക്ത ബാങ്കുകളുമായും കോർഡിനേറ്റർമാരുമായും എൻ്റെ വിവരങ്ങൾ പങ്കിടാൻ ഞാൻ സമ്മതിക്കുന്നു.
                  </span>
                </label>
              </div>
              {errors.consent && (
                <p className="mt-1.5 text-xs text-[#D92735] font-medium text-left">
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Submit Button with Submitting Disabled State */}
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
                    <span>Submitting Registration...</span>
                  </span>
                ) : (
                  <>
                    <span>Register as Donor</span>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
