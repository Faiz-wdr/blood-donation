import { Link, useSearchParams } from 'react-router-dom';
import BloodRequestForm from '../components/blood-request/BloodRequestForm';
import useSEO from '../hooks/useSEO';

/**
 * RequestBloodPage Component:
 * Dedicated route (/request-blood) for submitting emergency blood requests to Supabase.
 */
export default function RequestBloodPage() {
  useSEO({
    title: 'Emergency Blood Request — Blood Connect Kerala',
    description:
      'Submit an urgent blood request for hospital patients across Kerala. Rapidly connect with voluntary donors in Ernakulam, Kozhikode, Trivandrum, and all 14 districts.',
    canonical: '/request-blood',
  });

  const [searchParams] = useSearchParams();
  const initialBloodGroup = searchParams.get('group') || '';
  const initialDistrict = searchParams.get('district') || '';

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
            Emergency Blood Request
          </h1>
          <p className="mt-1 text-base sm:text-lg font-malayalam text-[#D92735] font-semibold">
            അടിയന്തര രക്ത ആവശ്യകത
          </p>
          <p className="mt-3 text-sm sm:text-base text-[#666666] leading-relaxed">
            Submit your requirement to Blood Connect Kerala. Our voluntary coordinator network connects patients directly with verified donors.
          </p>
        </div>

        {/* Mobile-First Blood Request Form */}
        <BloodRequestForm
          initialBloodGroup={initialBloodGroup}
          initialDistrict={initialDistrict}
        />
      </div>
    </div>
  );
}

