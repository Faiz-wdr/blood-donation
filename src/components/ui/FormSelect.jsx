import CustomSelect from './CustomSelect';

/**
 * Accessible, responsive FormSelect with English label on top and Malayalam text underneath in Google Font Manjari.
 * Uses CustomSelect for custom-styled dropdown tray in Blood Connect Kerala design system.
 */
export default function FormSelect({
  id,
  name,
  label,
  labelMl,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  helperText,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`w-full text-left ${className}`}>
      <div className="flex flex-col mb-1.5 text-left">
        <label
          htmlFor={id || name}
          className="text-sm font-semibold text-[#151515] flex items-center gap-1 cursor-pointer"
        >
          <span>{label}</span>
          {required && (
            <span className="text-[#D92735] font-bold" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {labelMl && (
          <span className="text-xs text-[#737373] font-malayalam mt-0.5 leading-tight">
            {labelMl}
          </span>
        )}
      </div>

      <CustomSelect
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        error={Boolean(error)}
        triggerClassName={`w-full flex items-center justify-between px-4 py-3.5 text-base rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
          error
            ? 'border-[#D92735] bg-[#D92735]/5 text-[#151515] ring-2 ring-[#D92735]/20'
            : value
            ? 'border-[#EAEAEA] bg-white text-[#151515] hover:border-[#D4D4D4] focus:border-[#D92735] focus:ring-2 focus:ring-[#D92735]/20'
            : 'border-[#EAEAEA] bg-[#F5F5F5] text-[#151515] hover:border-[#D4D4D4] focus:border-[#D92735] focus:ring-2 focus:ring-[#D92735]/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      />

      {error ? (
        <p
          id={`${name}-error`}
          className="mt-1.5 text-xs text-[#D92735] font-medium transition-all"
        >
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#737373]">{helperText}</p>
      ) : null}
    </div>
  );
}
