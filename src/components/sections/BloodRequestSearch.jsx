import { useState } from 'react';
import { BLOOD_GROUPS } from '../../data/bloodGroups';
import { KERALA_DISTRICTS } from '../../data/districts';
import { buildWhatsAppRequestUrl } from '../../utils/whatsapp';
import CustomSelect from '../ui/CustomSelect';

/**
 * BloodRequestSearch Component:
 * Horizontal rounded search interface from Hero:
 * - Blood Group selector
 * - District selector
 * - "Request Blood ↗" action button
 * - Validates selection before opening WhatsApp. If either Blood Group or District
 *   is missing, displays a validation modal popup without changing field colors or adding text.
 */
export default function BloodRequestSearch() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const isBloodGroupSelected = Boolean(bloodGroup && bloodGroup.trim() !== '' && bloodGroup !== 'Select blood group');
  const isDistrictSelected = Boolean(district && district.trim() !== '' && district !== 'All Districts' && district !== 'Select district');

  const handleRequestClick = (e) => {
    e.preventDefault();

    if (!isBloodGroupSelected || !isDistrictSelected) {
      setShowPopup(true);
      return;
    }

    const whatsappUrl = buildWhatsAppRequestUrl({ bloodGroup, district });
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div id="search" className="w-full max-w-4xl mx-auto scroll-mt-28">
        {/* Outer rounded container with refined elevation */}
        <div className="bg-white rounded-3xl md:rounded-full p-2.5 sm:p-3 shadow-xl shadow-black/[0.06] border border-[#EAEAEA] transition-all duration-300 hover:border-[#D4D4D4]">
          <form
            onSubmit={handleRequestClick}
            className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3 text-left"
          >
            {/* Field 1: Blood Group */}
            <div className="flex-1 px-5 py-3 rounded-2xl md:rounded-full hover:bg-[#F9F9F9] focus-within:bg-[#D92735]/5 focus-within:ring-2 focus-within:ring-[#D92735]/20 transition-all text-left group">
              <label
                htmlFor="hero-blood-group"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#737373] group-focus-within:text-[#D92735] mb-1 text-left transition-colors cursor-pointer"
              >
                Blood Group
              </label>
              <CustomSelect
                id="hero-blood-group"
                name="hero-blood-group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                options={BLOOD_GROUPS}
                placeholder="Select blood group"
                isHero
                triggerClassName="w-full flex items-center justify-between bg-transparent text-sm sm:text-base outline-none cursor-pointer text-left truncate transition-colors border-none p-0"
                trayClassName="mt-3 left-0 right-0 sm:w-72"
              />
            </div>

            {/* Vertical Divider on Desktop */}
            <div className="hidden md:block w-px h-10 bg-[#EAEAEA]" />

            {/* Field 2: District */}
            <div className="flex-1 px-5 py-3 rounded-2xl md:rounded-full hover:bg-[#F9F9F9] focus-within:bg-[#D92735]/5 focus-within:ring-2 focus-within:ring-[#D92735]/20 transition-all text-left group">
              <label
                htmlFor="hero-district"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#737373] group-focus-within:text-[#D92735] mb-1 text-left transition-colors cursor-pointer"
              >
                District
              </label>
              <CustomSelect
                id="hero-district"
                name="hero-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                options={KERALA_DISTRICTS}
                placeholder="Select district"
                isHero
                triggerClassName="w-full flex items-center justify-between bg-transparent text-sm sm:text-base outline-none cursor-pointer text-left truncate transition-colors border-none p-0"
                trayClassName="mt-3 left-0 right-0 sm:w-72"
              />
            </div>

            {/* Field 3: Action Button */}
            <div className="p-1">
              <button
                type="submit"
                onClick={handleRequestClick}
                className="w-full md:w-auto min-h-[52px] px-7 py-3.5 rounded-full bg-[#D92735] text-white font-semibold text-sm sm:text-base hover:bg-[#B81E2B] active:bg-[#9B1723] transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D92735] focus:ring-offset-2 flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Request Blood</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Validation Required Modal Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-fade-in"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl shadow-black/10 animate-in fade-in zoom-in-95 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Alert Indicator Icon */}
            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-[#D92735] flex items-center justify-center mb-4 border border-red-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-[#151515] tracking-tight">
              Selection Required
            </h3>
            <p className="mt-1 text-xs text-[#737373] font-malayalam font-semibold">
              രക്തഗ്രൂപ്പും ജില്ലയും തിരഞ്ഞെടുക്കുക
            </p>

            <p className="mt-3 text-xs sm:text-sm text-[#666666] leading-relaxed">
              Please select {!isBloodGroupSelected && !isDistrictSelected ? (
                <>both a <strong className="text-[#151515]">Blood Group</strong> and <strong className="text-[#151515]">District</strong></>
              ) : !isBloodGroupSelected ? (
                <>a <strong className="text-[#151515]">Blood Group</strong></>
              ) : (
                <>a <strong className="text-[#151515]">District</strong></>
              )}{' '}
              to request blood support on WhatsApp.
            </p>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full py-3.5 rounded-full bg-[#D92735] text-white text-sm font-semibold hover:bg-[#B81E2B] transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              Select Options
            </button>
          </div>
        </div>
      )}
    </>
  );
}
