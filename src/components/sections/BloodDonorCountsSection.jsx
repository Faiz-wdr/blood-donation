import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import BloodGroupCard from '../ui/BloodGroupCard';
import { useDonorCounts } from '../../hooks/useDonorCounts';
import { STANDARD_BLOOD_GROUPS } from '../../data/bloodGroups';

/**
 * BloodDonorCountsSection Component:
 * Displays verified donor counts for the 8 standard blood groups on the Home Page.
 * Includes a "View All" ghost button to explore all 19 blood groups (common + rare).
 */
export default function BloodDonorCountsSection() {
  const { counts, loading } = useDonorCounts();

  const standardCounts = counts.filter((item) =>
    STANDARD_BLOOD_GROUPS.includes(item.group)
  );

  return (
    <section id="donors" className="py-20 sm:py-28 bg-white border-t border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          title="Available Donors Across Kerala"
          description="A statewide voluntary registry ensuring immediate access to lifesaving blood for emergency patients and hospitals."
        />

        {/* 8 Blood Groups Grid with live count states */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {standardCounts.map((item) => (
            <BloodGroupCard
              key={item.group}
              bloodGroup={item.group}
              count={item.count}
              loading={loading}
            />
          ))}
        </div>

        {/* Ghost Button: View All Blood Groups */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            to="/all-donors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#151515] hover:text-[#D92735] bg-transparent hover:bg-[#F5F5F5] border border-[#151515] hover:border-[#D92735] transition-all cursor-pointer group shadow-2xs"
          >
            <span>View All Blood Groups</span>
            <svg
              className="w-4 h-4 text-[#151515] group-hover:text-[#D92735] group-hover:translate-x-0.5 transition-all"
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
    </section>
  );
}
