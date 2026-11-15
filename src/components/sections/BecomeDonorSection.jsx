import { Link } from 'react-router-dom';

/**
 * BecomeDonorSection Component:
 * Recreated following the attached banner image in our brand colors (#151515, #D92735, #FFFFFF):
 * - Rounded callout banner with rich dark/red gradient background and fluid ribbon graphic
 * - Bold headline & subtitle (no small eyebrow headings)
 * - White pill CTA button "Become a Donor →" which navigates to /register
 */
export default function BecomeDonorSection() {
  return (
    <section
      id="become-a-donor"
      className="py-16 sm:py-24 bg-white border-t border-[#EAEAEA] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Card Inspired by Reference Image */}
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#151515] border border-[#222222] shadow-2xl p-8 sm:p-12 lg:p-16">
          {/* Fluid Wave Ribbon Graphic in Brand Red & Translucent White (Pure SVG) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden opacity-90"
            aria-hidden="true"
          >
            <svg
              className="absolute right-0 top-0 w-full h-full object-cover scale-110 lg:scale-100"
              viewBox="0 0 1000 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMaxYMid slice"
            >
              <defs>
                <linearGradient id="waveRedGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D92735" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#B81E2B" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#D92735" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="waveWhiteRibbon" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
                  <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
                </linearGradient>
                <filter id="waveBlur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="35" />
                </filter>
              </defs>

              {/* Background ambient red glow */}
              <circle cx="850" cy="250" r="280" fill="url(#waveRedGlow)" filter="url(#waveBlur)" />
              <circle cx="550" cy="380" r="180" fill="#D92735" opacity="0.35" filter="url(#waveBlur)" />

              {/* Sweeping 3D fluid wave ribbons */}
              <path
                d="M 280 500 C 450 480, 520 280, 680 220 C 840 160, 920 180, 1050 120 L 1050 500 Z"
                fill="url(#waveRedGlow)"
                opacity="0.4"
              />
              <path
                d="M 320 500 C 480 440, 560 220, 720 180 C 880 140, 940 220, 1050 100"
                stroke="url(#waveWhiteRibbon)"
                strokeWidth="70"
                strokeLinecap="round"
                fill="none"
                opacity="0.75"
              />
              <path
                d="M 360 500 C 500 420, 600 240, 760 190 C 900 150, 980 240, 1050 160"
                stroke="#FFFFFF"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
                filter="url(#waveBlur)"
              />
            </svg>
          </div>

          {/* Banner Left Foreground Content */}
          <div className="relative z-10 max-w-xl text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Your Small Step Can Save a Life.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed max-w-lg">
              Join Blood Connect Kerala and become part of a voluntary network helping people in need across all 14 districts.
            </p>

            <div className="mt-8 flex items-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-[#151515] font-semibold text-sm sm:text-base hover:bg-[#F5F5F5] active:bg-[#EAEAEA] transition-all duration-200 shadow-lg hover:shadow-xl hover:translate-x-0.5 cursor-pointer group"
              >
                <span>Become a Donor</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-150"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
