import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BloodGroupCard from '../components/ui/BloodGroupCard';
import CustomSelect from '../components/ui/CustomSelect';
import { useDonorCounts } from '../hooks/useDonorCounts';
import { KERALA_DISTRICTS } from '../data/districts';
import { STANDARD_BLOOD_GROUPS, RARE_BLOOD_GROUPS } from '../data/bloodGroups';

/**
 * AllDonorsPage Component:
 * Dedicated page displaying real-time donor counts across all 19 blood groups
 * (8 standard groups + 11 rare & ultra-rare groups) with statewide and district-level filters.
 */
export default function AllDonorsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const { counts, loading } = useDonorCounts(selectedDistrict || null);

  useEffect(() => {
    document.title = 'All Blood Groups & Verified Donors | Blood Connect Kerala';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const countsMap = counts.reduce((acc, item) => {
    acc[item.group] = item.count;
    return acc;
  }, {});

  const standardList = STANDARD_BLOOD_GROUPS.map((group) => ({
    group,
    count: countsMap[group] || 0,
    note: group.includes('-') ? 'Rh Negative' : 'Rh Positive',
  }));

  const rareList = RARE_BLOOD_GROUPS.map((group) => ({
    group,
    count: countsMap[group] || 0,
    note: 'Rare Group',
  }));

  return (
    <div className="flex-1 bg-[#FAFAFA] py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link - Center Aligned */}
        <div className="mb-6 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EAEAEA] text-sm font-semibold text-[#666666] hover:text-[#151515] hover:border-[#D4D4D4] hover:bg-[#F5F5F5] transition-all shadow-2xs group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#151515] tracking-tight">
            All Blood Groups & Donors
          </h1>
          <p className="mt-1 text-base sm:text-lg font-malayalam text-[#D92735] font-semibold">
            എല്ലാ രക്തഗ്രൂപ്പുകളിലെയും ദാതാക്കൾ
          </p>
          <p className="mt-3 text-sm sm:text-base text-[#666666] leading-relaxed">
            Live statewide registry tracking verified donors across all 19 common and rare blood groups in Kerala.
          </p>
        </div>

        {/* Filter Bar: District Selector */}
        <div className="mb-12 max-w-md mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-[#EAEAEA] shadow-xs text-left">
          <label
            htmlFor="all-donors-district"
            className="block text-xs font-bold uppercase tracking-wider text-[#737373] mb-1.5 cursor-pointer"
          >
            Filter by District
          </label>
          <CustomSelect
            id="all-donors-district"
            name="all-donors-district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={[
              { value: '', label: 'All Kerala (Statewide)' },
              ...KERALA_DISTRICTS.map((d) => ({ value: d, label: d })),
            ]}
            placeholder="All Kerala (Statewide)"
          />
        </div>

        {/* Section 1: Standard Blood Groups (8) */}
        <div className="mb-14">
          <div className="mb-6 pb-3 border-b border-[#EAEAEA]">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#151515] tracking-tight">
              Standard Blood Groups
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {standardList.map((item) => (
              <BloodGroupCard
                key={item.group}
                bloodGroup={item.group}
                count={item.count}
                note={item.note}
                loading={loading}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Rare & Ultra-Rare Blood Groups (11) */}
        <div className="mb-16">
          <div className="mb-6 pb-3 border-b border-[#EAEAEA]">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#151515] tracking-tight">
              Rare & Specialized Blood Groups
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {rareList.map((item) => (
              <BloodGroupCard
                key={item.group}
                bloodGroup={item.group}
                count={item.count}
                note={item.note}
                loading={loading}
              />
            ))}
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 text-center max-w-3xl mx-auto shadow-xs">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#151515]">
            Have a Rare Blood Group?
          </h3>
          <p className="mt-2 text-sm sm:text-base text-[#666666] max-w-xl mx-auto">
            Patients requiring rare and ultra-rare blood types rely entirely on voluntary donors registered in advance.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#D92735] text-white font-semibold text-sm hover:bg-[#B81E2B] transition-colors shadow-md"
            >
              Register as a Donor
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#151515] font-semibold text-sm transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
