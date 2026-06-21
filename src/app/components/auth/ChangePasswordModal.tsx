import { useState } from 'react';
import { Lock, Eye, EyeOff, X, CheckCircle2, Circle } from 'lucide-react';

interface Props { onClose: () => void; }
type Strength = 0 | 1 | 2 | 3 | 4;

const STRENGTH_CONFIG: Record<Strength, { label: string; color: string; bars: number }> = {
  0: { label: '',            color: '',               bars: 0 },
  1: { label: 'Weak',        color: 'bg-red-500',     bars: 1 },
  2: { label: 'Fair',        color: 'bg-amber-400',   bars: 2 },
  3: { label: 'Strong',      color: 'bg-accent',      bars: 3 },
  4: { label: 'Very Strong', color: 'bg-emerald-500', bars: 4 },
};

const STRENGTH_TEXT: Record<Strength, string> = {
  0: 'text-muted-foreground',
  1: 'text-red-600',
  2: 'text-amber-600',
  3: 'text-accent',
  4: 'text-emerald-700',
};

function getStrength(p: string): Strength {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s as Strength;
}

export function ChangePasswordModal({ onClose }: Props) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const strength = getStrength(newPass);
  const cfg = STRENGTH_CONFIG[strength];

  const checks = [
    { label: 'At least 8 characters',  met: newPass.length >= 8 },
    { label: 'One uppercase letter',    met: /[A-Z]/.test(newPass) },
    { label: 'One number',             met: /[0-9]/.test(newPass) },
    { label: 'One special character',  met: /[^A-Za-z0-9]/.test(newPass) },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!current) { setError('Please enter your current password.'); return; }
    if (strength < 3) { setError('Please choose a stronger password.'); return; }
    if (newPass !== confirm) { setError('New passwords do not match.'); return; }
    setError('');
    setSuccess(true);
    setTimeout(onClose, 2000);
  }

  const inputCls = 'w-full pl-10 pr-11 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-muted-foreground';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-[480px] mx-4 overflow-hidden"
        style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.25)', animation: 'fadeInScale 0.18s ease-out' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex justify-end px-5 pt-5 pb-0">
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-8 pt-2 pb-8">
          {success ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Password Updated</h3>
              <p className="text-sm text-muted-foreground">Your password has been changed successfully.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-secondary">
                  <Lock size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Change Password</h3>
                <p className="text-sm text-muted-foreground mt-1.5 text-center leading-relaxed">
                  Your new password must be different from your previous password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordField label="Current Password" value={current} onChange={setCurrent}
                  show={showCurrent} onToggle={() => setShowCurrent(v => !v)} cls={inputCls} placeholder="Enter your current password" />

                <div>
                  <PasswordField label="New Password" value={newPass} onChange={setNewPass}
                    show={showNew} onToggle={() => setShowNew(v => !v)} cls={inputCls} placeholder="Create a new password" />
                  {newPass.length > 0 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1 flex-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= cfg.bars ? cfg.color : 'bg-border'}`} />
                          ))}
                        </div>
                        {cfg.label && <span className={`text-xs font-bold ${STRENGTH_TEXT[strength]}`}>{cfg.label}</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {checks.map(c => (
                          <div key={c.label} className="flex items-center gap-1.5">
                            {c.met
                              ? <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                              : <Circle size={13} className="text-border flex-shrink-0" />}
                            <span className={`text-xs ${c.met ? 'text-emerald-700' : 'text-muted-foreground'}`}>{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <PasswordField label="Confirm New Password" value={confirm} onChange={setConfirm}
                    show={showConfirm} onToggle={() => setShowConfirm(v => !v)} cls={inputCls} placeholder="Re-enter your new password" />
                  {confirm && newPass !== confirm && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><X size={11} /> Passwords do not match</p>
                  )}
                  {confirm && newPass === confirm && confirm.length > 0 && (
                    <p className="text-xs text-emerald-700 mt-1.5 flex items-center gap-1"><CheckCircle2 size={11} /> Passwords match</p>
                  )}
                </div>

                {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose}
                    className="flex-1 py-3 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"
                    style={{ boxShadow: '0 4px 14px rgba(110,18,22,0.35)' }}>
                    Update Password
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeInScale{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, cls, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; cls: string; placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
        <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}
