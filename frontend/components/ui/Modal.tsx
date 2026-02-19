import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus trap inside modal
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-deep-brown/30 backdrop-blur-sm fade-in-up" />

      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-white/95 backdrop-blur-xl border-2 border-amber-200 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4a543 #f5f5f5' }}
      >
        <div className="bg-gradient-to-r from-amber-400 to-amber-300 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-deep-brown font-display">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-deep-brown/70 hover:text-deep-brown transition-colors text-2xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
