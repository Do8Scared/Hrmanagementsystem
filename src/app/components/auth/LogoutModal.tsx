import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)', animation: 'fadeInScale 0.18s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-[#F7F8FA] hover:text-[#6B7280] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pt-2 pb-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
            <LogOut size={28} className="text-[#E53E3E]" />
          </div>

          <h3 className="text-xl font-bold text-[#1E2A4A] mb-2">Log Out?</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-7">
            Are you sure you want to log out of your account? Any unsaved changes will be lost.
          </p>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-[#F7F8FA] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
              style={{
                background: '#E53E3E',
                boxShadow: '0 4px 14px rgba(229,62,62,0.35)',
              }}
            >
              <LogOut size={15} />
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
