/**
 * Accessible, responsive FormInput with English label on top and Malayalam text underneath in Google Font Manjari (no slashes)
 */
export default function FormInput({
  id,
  name,
  label,
  labelMl,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  helperText,
  disabled = false,
  className = '',
  ...props
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

      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-4 py-3.5 text-base bg-[#F5F5F5] text-[#151515] placeholder:text-[#999999] rounded-2xl border transition-all duration-200 outline-none
          ${
            error
              ? 'border-[#D92735] bg-[#D92735]/5 focus:border-[#D92735] focus:ring-2 focus:ring-[#D92735]/20'
              : 'border-[#EAEAEA] hover:border-[#D4D4D4] focus:border-[#D92735] focus:bg-white focus:ring-2 focus:ring-[#D92735]/20'
          }
          disabled:opacity-50 disabled:cursor-not-allowed`}
        {...props}
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
