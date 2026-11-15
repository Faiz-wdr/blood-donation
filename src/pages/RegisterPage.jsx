import { Link } from 'react-router-dom';
import DonorRegistrationForm from '../components/donor-form/DonorRegistrationForm';
import BloodGroupCard from '../components/ui/BloodGroupCard';
import { useDonorCounts } from '../hooks/useDonorCounts';
import { STANDARD_BLOOD_GROUPS } from '../data/bloodGroups';

/**
 * RegisterPage Component:
 * Dedicated standalone page for Donor Registration.
 * Mobile-first design with Malayalam subtitles in Google Font Manjari.
 * Displays live compact donor counts by blood group below the registration form.
 */
export default function RegisterPage() {
  const { counts, loading } = useDonorCounts();

  const standardCounts = counts.filter((item) =>
    STANDARD_BLOOD_GROUPS.includes(item.group)
  );

  return (
    <div className="flex-1 bg-[#FAFAFA] py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="mb-8 sm:mb-10 text-center max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#151515] tracking-tight">
            Become a Blood Donor
          </h1>
          <p className="mt-1 text-base sm:text-lg font-malayalam text-[#D92735] font-semibold">
            ഒരു രക്തദാതാവാകൂ
          </p>
        </div>

        {/* Mobile-First Form Component */}
        <DonorRegistrationForm />

        {/* Verified Donor Counts by Blood Group (Mobile-First Layout matching form width) */}
        <div className="w-full max-w-xl mx-auto mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[#EAEAEA]">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#151515] tracking-tight">
              Verified Donors by Blood Group
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-malayalam text-[#737373] font-semibold">
              രക്തഗ്രൂപ്പ് തിരിച്ചുള്ള ദാതാക്കളുടെ വിവരങ്ങൾ
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {standardCounts.map((item) => (
              <BloodGroupCard
                key={item.group}
                bloodGroup={item.group}
                count={item.count}
                loading={loading}
                compact
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              to="/all-donors"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#EAEAEA] hover:border-[#D4D4D4] text-xs font-semibold text-[#151515] hover:text-[#D92735] transition-all shadow-2xs group"
            >
              <span>View all 19 blood groups</span>
              <svg
                className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#D92735] group-hover:translate-x-0.5 transition-all"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

