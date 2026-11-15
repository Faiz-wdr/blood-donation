/**
 * Minimal, clean BloodGroupCard component matching the design tokens:
 * - Minimal white card with subtle border and light-gray background on hover
 * - Red blood group accent
 * - Large, crisp, readable numbers
 * - No icons, no emojis
 */

function parseBloodGroup(bg) {
  if (typeof bg !== 'string') return { primary: bg, secondary: null };
  const match = bg.match(/^(.*?)\s*(\(.*?\))$/);
  if (match) {
    return { primary: match[1].trim(), secondary: match[2].trim() };
  }
  return { primary: bg, secondary: null };
}

function getBadgeFontSize(text, isCompact = false) {
  const len = text ? text.length : 0;
  if (isCompact) {
    return len > 3 ? 'text-[10px] sm:text-xs tracking-tight' : 'text-xs sm:text-sm';
  }
  if (len <= 3) {
    return 'text-lg sm:text-2xl';
  }
  if (len <= 5) {
    return 'text-sm sm:text-lg';
  }
  return 'text-xs sm:text-base tracking-tight';
}

export default function BloodGroupCard({ bloodGroup, count, note, loading = false, compact = false }) {
  const { primary, secondary } = parseBloodGroup(bloodGroup);
  const badgeFont = getBadgeFontSize(primary, compact);

  if (compact) {
    return (
      <div className="group relative bg-white border border-[#EAEAEA] rounded-2xl p-3 sm:p-4 transition-all duration-200 hover:border-[#D92735]/40 hover:shadow-xs active:scale-[0.99] flex flex-col justify-between text-left select-none">
        {/* Top row: Blood group indicator badge & note */}
        <div className="flex items-start justify-between gap-1.5 mb-2">
          <div className="flex flex-col items-start min-w-0">
            <span
              className={`inline-flex items-center justify-center min-w-8 h-7 px-2 rounded-xl bg-[#D92735]/10 text-[#D92735] font-extrabold whitespace-nowrap transition-colors group-hover:bg-[#D92735] group-hover:text-white ${badgeFont}`}
            >
              {primary}
            </span>
            {secondary && (
              <span className="mt-1 text-[9px] sm:text-[10px] text-[#737373] font-medium leading-tight">
                {secondary}
              </span>
            )}
          </div>
          {note && (
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-wide text-[#737373] uppercase shrink-0 pt-0.5 text-right">
              {note}
            </span>
          )}
        </div>

        {/* Middle/Bottom: Readable count & label */}
        <div className="mt-auto pt-1">
          <div className="text-xl sm:text-2xl font-extrabold text-[#151515] tracking-tight group-hover:text-[#D92735] transition-colors min-h-[28px] flex items-center">
            {loading ? (
              <span className="inline-block w-10 h-6 bg-[#EAEAEA] rounded-md animate-pulse" />
            ) : (
              (count || 0).toLocaleString('en-IN')
            )}
          </div>
          <p className="mt-0.5 text-[11px] sm:text-xs text-[#666666] font-medium leading-tight">
            Verified Donors
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-[#EAEAEA] rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-[#D92735]/40 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between">
      {/* Top row: Blood group indicator badge & note */}
      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
        <div className="flex flex-col items-start min-w-0">
          <span
            className={`inline-flex items-center justify-center min-w-10 sm:min-w-12 h-8 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#D92735]/10 text-[#D92735] font-extrabold whitespace-nowrap transition-colors group-hover:bg-[#D92735] group-hover:text-white ${badgeFont}`}
          >
            {primary}
          </span>
          {secondary && (
            <span className="mt-1.5 text-[10px] sm:text-xs text-[#737373] font-medium leading-tight">
              {secondary}
            </span>
          )}
        </div>
        {note && (
          <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider text-[#737373] uppercase shrink-0 pt-1 text-right">
            {note}
          </span>
        )}
      </div>

      {/* Middle/Bottom: Large readable count & label */}
      <div className="mt-auto pt-2">
        <div className="text-2xl sm:text-4xl font-extrabold text-[#151515] tracking-tight group-hover:text-[#D92735] transition-colors min-h-[32px] sm:min-h-[40px] flex items-center">
          {loading ? (
            <span className="inline-block w-12 sm:w-16 h-7 sm:h-8 bg-[#EAEAEA] rounded-md animate-pulse" />
          ) : (
            (count || 0).toLocaleString('en-IN')
          )}
        </div>
        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-[#666666] font-medium">
          Verified Donors
        </p>
      </div>
    </div>
  );
}
