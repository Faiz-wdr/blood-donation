import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import BloodDonorCountsSection from '../components/sections/BloodDonorCountsSection';
import BecomeDonorSection from '../components/sections/BecomeDonorSection';
import useSEO from '../hooks/useSEO';

/**
 * HomePage Component:
 * Strict 4 Sections:
 * 1. Hero
 * 2. About
 * 3. Blood Donor Counts
 * 4. Become a Donor (Banner with CTA to /register)
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
      <AboutSection />
      <BloodDonorCountsSection />
      <BecomeDonorSection />
    </div>
  );
}
