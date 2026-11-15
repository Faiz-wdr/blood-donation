import BloodRequestSearch from './BloodRequestSearch';
import HeroMapBackground from './HeroMapBackground';

/**
 * HeroSection Component:
 * Clean, spacious hero closely matching the reference layout:
 * - Stylized vector map background with roads, water, and labels
 * - 4 blood drop shaped pins in brand primary red (#D92735) with lightweight bouncing animations
 * - Large, crisp heading: "One Donation. A Lifetime of Hope."
 * - Minimal supporting description
 * - Prominent floating horizontal search interface as the visual focal point
 */
export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-center pt-16 pb-24 sm:pt-20 sm:pb-32 overflow-hidden bg-white"
    >
      {/* Map Background with Bouncing Blood Drop Pins */}
      <HeroMapBackground />

      {/* Main Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#151515] leading-[1.08] sm:leading-[1.06]">
          One Donation.
          <br />
          <span className="text-[#D92735]">A Lifetime of Hope.</span>
        </h1>

        {/* Supporting Description */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
          Connecting voluntary blood donors with people who need blood across Kerala.
        </p>

        {/* Blood Request Search Interface (Prominent focal point floating above map) */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <BloodRequestSearch />
        </div>
      </div>
    </section>
  );
}
