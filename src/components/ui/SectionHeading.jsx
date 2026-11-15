/**
 * Reusable SectionHeading component following the reference layout:
 * - Eyebrow label with subtle dot indicator
 * - Bold primary headline with tight letter-spacing
 * - Optional Malayalam sub-headline
 * - Optional description text
 */
export default function SectionHeading({
  eyebrow,
  title,
  malayalamSubtitle,
  description,
  align = 'center',
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <div
      className={`max-w-3xl ${isCenter ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 mb-3.5 px-3 py-1 rounded-full bg-[#F5F5F5] border border-[#EAEAEA] text-xs font-semibold tracking-wider uppercase text-[#151515]`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D92735]" />
          <span>{eyebrow}</span>
        </div>
      )}

      {title && (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#151515] leading-[1.12] whitespace-pre-line">
          {title}
        </h2>
      )}

      {malayalamSubtitle && (
        <p className="mt-3.5 text-base sm:text-lg font-medium text-[#151515]/80 leading-relaxed font-sans">
          {malayalamSubtitle}
        </p>
      )}

      {description && (
        <p className="mt-4 text-base sm:text-lg text-[#666666] leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
