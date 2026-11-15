/**
 * HeroMapBackground Component:
 * - Map is visible strictly in the lower region of the hero section, fading out completely into white at the top.
 * - 4 animated blood drop pins placed strictly on the sides and bottom (none under text).
 * - Circular blood group badge (O+, B-, A-, B+) floating above each blood drop.
 * - Exact blood drop shape from the user's reference: sharp top, bulbous rounded base,
 *   primary red fill (#D92735), with sleek white curved reflection along the left edge.
 * - Lightweight bouncing animations.
 */
export default function HeroMapBackground() {
  const pins = [
    {
      id: 'pin-left',
      city: 'Kochi',
      group: 'O+',
      position: 'top-[52%] sm:top-[56%] left-[3%] sm:left-[6%] lg:left-[8%]',
      bounceClass: 'animate-pin-bounce',
      pulseClass: 'animate-pin-pulse',
    },
    {
      id: 'pin-bottom-left',
      city: 'Thrissur',
      group: 'B-',
      position: 'top-[82%] sm:top-[85%] left-[16%] sm:left-[22%] lg:left-[26%]',
      bounceClass: 'animate-pin-bounce-delay-2',
      pulseClass: 'animate-pin-pulse-delay-2',
    },
    {
      id: 'pin-bottom-right',
      city: 'Trivandrum',
      group: 'A-',
      position: 'top-[84%] sm:top-[87%] right-[16%] sm:right-[22%] lg:right-[26%]',
      bounceClass: 'animate-pin-bounce-delay-3',
      pulseClass: 'animate-pin-pulse-delay-3',
    },
    {
      id: 'pin-right',
      city: 'Kozhikode',
      group: 'B+',
      position: 'top-[50%] sm:top-[54%] right-[3%] sm:right-[6%] lg:right-[8%]',
      bounceClass: 'animate-pin-bounce-delay-1',
      pulseClass: 'animate-pin-pulse-delay-1',
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Map container with top fade to pure white (map visible strictly in bottom half) */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 38%, black 72%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 38%, black 72%, black 100%)',
        }}
      >
        <svg
          className="w-full h-full object-cover opacity-70"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Base soft map terrain */}
          <rect width="1440" height="900" fill="#FAFBFD" />

          {/* Waterway / Coastal inlet ribbons in bottom area */}
          <path
            d="M -50 350 C 120 420, 240 380, 380 500 C 520 620, 480 720, 620 820 C 760 920, 920 860, 1100 980 L -50 980 Z"
            fill="#F0F4F8"
            opacity="0.85"
          />
          <path
            d="M 1250 150 C 1220 320, 1340 450, 1280 620 C 1220 780, 1360 880, 1480 980 L 1480 150 Z"
            fill="#F2F5F9"
            opacity="0.75"
          />

          {/* Secondary road network (delicate gray grid in bottom) */}
          <g stroke="#E8EAF0" strokeWidth="1" opacity="0.9">
            <line x1="80" y1="200" x2="320" y2="900" />
            <line x1="240" y1="200" x2="540" y2="900" />
            <line x1="480" y1="200" x2="720" y2="900" />
            <line x1="720" y1="200" x2="980" y2="900" />
            <line x1="960" y1="200" x2="1180" y2="900" />
            <line x1="1200" y1="200" x2="1380" y2="900" />

            <line x1="0" y1="380" x2="1440" y2="420" />
            <line x1="0" y1="520" x2="1440" y2="560" />
            <line x1="0" y1="680" x2="1440" y2="670" />
            <line x1="0" y1="820" x2="1440" y2="810" />

            {/* Local sub-streets */}
            <path d="M 100 480 Q 250 450 380 540 T 600 620" fill="none" />
            <path d="M 300 380 Q 420 460 560 420 T 800 480" fill="none" />
            <path d="M 650 450 Q 780 520 920 480 T 1150 520" fill="none" />
            <path d="M 200 720 Q 400 660 620 740 T 900 720" fill="none" />
            <path d="M 850 350 Q 980 440 1100 400 T 1320 460" fill="none" />
          </g>

          {/* Primary Arteries / Highways */}
          <g stroke="#DCE0EA" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M 40 280 C 180 380, 220 520, 420 600 C 620 680, 840 640, 1020 760 C 1200 880, 1340 900, 1460 980" />
            <path d="M 980 200 C 860 360, 780 500, 560 580 C 340 660, 300 800, 220 980" />
            <path d="M -20 640 C 220 600, 480 660, 720 600 C 960 540, 1180 620, 1460 580" />
            <path d="M 320 250 C 440 420, 680 500, 760 700 C 840 880, 920 940, 1100 980" />
          </g>

          {/* Highway white inner core lines */}
          <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none">
            <path d="M 40 280 C 180 380, 220 520, 420 600 C 620 680, 840 640, 1020 760 C 1200 880, 1340 900, 1460 980" />
            <path d="M 980 200 C 860 360, 780 500, 560 580 C 340 660, 300 800, 220 980" />
            <path d="M -20 640 C 220 600, 480 660, 720 600 C 960 540, 1180 620, 1460 580" />
            <path d="M 320 250 C 440 420, 680 500, 760 700 C 840 880, 920 940, 1100 980" />
          </g>

          {/* Regional labels in lower half */}
          <g fill="#A1A7B4" fontSize="10" fontWeight="600" letterSpacing="0.8">
            <text x="210" y="460">KOZHIKODE</text>
            <text x="310" y="620">MALABAR ROAD</text>
            <text x="540" y="520">THRISSUR</text>
            <text x="560" y="700">ERNAKULAM</text>
            <text x="740" y="610">ALUVA</text>
            <text x="880" y="740">KOTTAYAM</text>
            <text x="960" y="840">TRIVANDRUM</text>
            <text x="1150" y="520">PALAKKAD</text>
          </g>
        </svg>
      </div>

      {/* 2. Top pure white protection gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white via-white/95 to-transparent pointer-events-none" />

      {/* 3. Bouncing Blood Drop Pins with Circular Blood Group Badges */}
      <div className="absolute inset-0 pointer-events-auto">
        {pins.map((pin) => (
          <div
            key={pin.id}
            className={`absolute ${pin.position} flex flex-col items-center select-none group cursor-pointer`}
          >
            {/* The Bouncing Group + Blood Drop Pin */}
            <div className={`flex flex-col items-center ${pin.bounceClass}`}>
              {/* Circular Blood Group Badge above the drop */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-[#EAEAEA] shadow-md shadow-black/10 flex items-center justify-center mb-1 transition-all duration-200 group-hover:scale-110 group-hover:border-[#D92735] group-hover:shadow-lg">
                <span className="text-[10px] sm:text-[11px] font-black tracking-tight text-[#151515] group-hover:text-[#D92735]">
                  {pin.group}
                </span>
              </div>

              {/* Blood Drop Shape Matching Reference Image */}
              <div className="relative transform transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_4px_10px_rgba(217,39,53,0.35)]">
                <svg
                  className="w-6 h-8 sm:w-7 sm:h-9"
                  viewBox="0 0 100 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Red Droplet Contour */}
                  <path
                    d="M50 8C50 8 16 54 16 80C16 99.88 31.22 116 50 116C68.78 116 84 99.88 84 80C84 54 50 8 50 8Z"
                    fill="#D92735"
                  />
                  {/* Sleek Curved White Reflection Highlight along left edge */}
                  <path
                    d="M39 52C31 63 26 75 27 86C28 96 35 102 48 104C41 102 32 96 30 86C28 76 32 64 39 52Z"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>
            </div>

            {/* Soft Shadow at the base */}
            <div
              className={`w-4 h-1.5 bg-[#151515]/20 rounded-full blur-[1px] mt-1 ${pin.pulseClass}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
