import { useState, useRef, useEffect } from 'react';

/**
 * CustomSelect:
 * Accessible, customizable dropdown matching Blood Connect Kerala design system:
 * - Replaces OS default native select trays with our custom-styled dropdown tray
 * - Floating tray with white background, subtle border, rounded-2xl, and soft shadow
 * - Active / selected item highlighted in brand red with checkmark
 * - Outside click / touch dismissal and Escape key support
 * - Emits standard synthetic event { target: { name, value } } for full form compatibility
 */
export default function CustomSelect({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error = false,
  className = '',
  triggerClassName = '',
  trayClassName = '',
  isHero = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: String(opt.value), label: String(opt.label) };
    }
    return { value: String(opt), label: String(opt) };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === String(value));
  const isSelected = Boolean(selectedOption && selectedOption.value !== '' && selectedOption.value !== 'all');
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optValue) => {
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: { name: name || id || '', value: optValue },
        currentTarget: { name: name || id || '', value: optValue },
      }, optValue);
    }
  };

  return (
    <div
      ref={selectRef}
      className={`relative text-left ${isOpen ? 'z-50' : 'z-10'} ${className}`}
    >
      {/* Hidden input to ensure native form serialization if needed */}
      <input type="hidden" name={name || id} value={value || ''} />

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={
          triggerClassName ||
          `w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl border transition-all cursor-pointer text-left ${
            error
              ? 'border-[#D92735] bg-[#D92735]/5 text-[#151515] ring-2 ring-[#D92735]/20'
              : isOpen
              ? 'border-[#D92735] bg-white ring-2 ring-[#D92735]/20 text-[#151515]'
              : 'border-[#EAEAEA] bg-[#F5F5F5] hover:border-[#D4D4D4] text-[#151515]'
          } disabled:opacity-50 disabled:cursor-not-allowed`
        }
      >
        <span
          className={`truncate ${
            !isSelected && !isHero
              ? 'text-[#737373]'
              : isHero && isSelected
              ? 'text-[#D92735] font-bold'
              : 'text-[#151515] font-semibold'
          }`}
        >
          {displayText}
        </span>

        {/* Minimal Pure SVG Chevron */}
        <span
          className={`shrink-0 ml-2 text-[#737373] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#D92735]' : ''
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 8 10 12 14 8" />
          </svg>
        </span>
      </button>

      {/* Custom Dropdown Tray in Design Theme */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={placeholder}
          className={`absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-[#EAEAEA] rounded-2xl shadow-xl shadow-black/10 py-1.5 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 ${trayClassName}`}
        >
          {placeholder && !isHero && (
            <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#737373] border-b border-[#EAEAEA]/60 mb-1 select-none">
              {placeholder}
            </div>
          )}
          {normalizedOptions.map((opt) => {
            const itemSelected = String(value) === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={itemSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm transition-colors text-left cursor-pointer ${
                  itemSelected
                    ? 'bg-[#D92735]/10 text-[#D92735] font-bold'
                    : 'text-[#151515] font-medium hover:bg-[#F5F5F5] hover:text-[#D92735]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {itemSelected && (
                  <svg
                    className="w-4 h-4 text-[#D92735] shrink-0 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

