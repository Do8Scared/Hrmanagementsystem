import { LogOut, X } from 'lucide-react';

interface LogoutModalProps { onConfirm: () => void; onCancel: () => void; }

export function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}>
      <div className="bg-card rounded-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)', animation: 'fadeInScale 0.18s ease-out' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex justify-end px-4 pt-4">
          <button onClick={onCancel} className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-8 pt-2 pb-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-5">
            <LogOut size={28} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Log Out?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-7">
            Are you sure you want to log out of your account? Any unsaved changes will be lost.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-1.5"
              style={{ boxShadow: '0 4px 14px rgba(220,38,38,0.35)' }}>
              <LogOut size={15} /> Yes, Log Out
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeInScale{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}
