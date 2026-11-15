import HeroSection from '../components/sections/HeroSection';
import BloodDonorCountsSection from '../components/sections/BloodDonorCountsSection';
import AboutSection from '../components/sections/AboutSection';
import BecomeDonorSection from '../components/sections/BecomeDonorSection';
import useSEO from '../hooks/useSEO';

/**
 * HomePage Component:
 * Reordered Sections:
 * 1. Hero Section
 * 2. Blood Donor Counts Section
 * 3. About Section
 * 4. Become a Donor Section (Banner with CTA to /register)
 */
export default function HomePage() {
  useSEO({
    title: 'Blood Connect Kerala — Voluntary Blood Donors Network in Kerala',
    description:
      'Find verified voluntary blood donors across Kerala. Connect with donors for rare and emergency blood groups in all 14 districts. Free, direct citizen initiative.',
    canonical: '/',
  });

  return (
    <div className="flex-1">
      <HeroSection />
      <BloodDonorCountsSection />
      <AboutSection />
      <BecomeDonorSection />
    </div>
  );
}
