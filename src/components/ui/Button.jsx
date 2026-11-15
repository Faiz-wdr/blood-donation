/**
 * Minimal reusable Button component matching the design system
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  href,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-normal transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary:
      'bg-[#D92735] text-white hover:bg-[#B81E2B] active:bg-[#9B1723] focus-visible:outline-[#D92735] shadow-xs hover:shadow-sm',
    dark:
      'bg-[#151515] text-white hover:bg-[#282828] active:bg-[#000000] focus-visible:outline-[#151515]',
    outline:
      'bg-white text-[#151515] border border-[#E0E0E0] hover:border-[#151515] hover:bg-[#F9F9F9] focus-visible:outline-[#151515]',
    ghost:
      'bg-transparent text-[#151515] hover:bg-[#F5F5F5] active:bg-[#EBEBEB] focus-visible:outline-[#151515]',
    softRed:
      'bg-[#D92735]/10 text-[#D92735] hover:bg-[#D92735]/15 focus-visible:outline-[#D92735]',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 rounded-full',
    md: 'text-sm px-5 py-2.5 rounded-full',
    lg: 'text-base px-6 py-3.5 rounded-full',
    xl: 'text-base sm:text-lg px-7 py-4 rounded-full font-semibold',
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`.trim();

  if (href || Component === 'a') {
    return (
      <a href={href} onClick={onClick} className={combinedClasses} {...props}>
        {children}
      </a>
    );
  }

  if (Component !== 'button') {
    return (
      <Component onClick={onClick} className={combinedClasses} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
