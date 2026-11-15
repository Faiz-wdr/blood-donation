import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import BloodDonorCountsSection from '../components/sections/BloodDonorCountsSection';
import BecomeDonorSection from '../components/sections/BecomeDonorSection';

/**
 * HomePage Component:
 * Strict 4 Sections:
 * 1. Hero
 * 2. About
 * 3. Blood Donor Counts
 * 4. Become a Donor (Banner with CTA to /register)
 */
export default function HomePage() {
  return (
    <div className="flex-1">
      <HeroSection />
      <AboutSection />
      <BloodDonorCountsSection />
      <BecomeDonorSection />
    </div>
  );
}

