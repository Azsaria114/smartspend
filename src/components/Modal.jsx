import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content w-full max-w-lg mx-4">
        <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
          {title && (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

