import { useEffect } from 'react';
import BloodRequestForm from './BloodRequestForm';

/**
 * BloodRequestModal:
 * Clean, accessible modal dialog for submitting emergency blood requests.
 * Supports ESC key to close, backdrop click, and prefilled blood group/district.
 */
export default function BloodRequestModal({
  isOpen,
  onClose,
  initialBloodGroup = '',
  initialDistrict = '',
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 py-8 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl my-auto">
        <BloodRequestForm
          initialBloodGroup={initialBloodGroup}
          initialDistrict={initialDistrict}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

