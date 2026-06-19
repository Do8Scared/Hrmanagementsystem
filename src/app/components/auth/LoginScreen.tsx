import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import corazonLogo from '@/imports/Screenshot_2026-06-18_at_10.57.47_PM.png';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

type AuthView = 'login' | 'forgot-password' | 'session-expired';

interface LoginScreenProps {
  onLogin: (role: 'admin' | 'employee') => void;
  initialView?: AuthView;
  sessionEmail?: string;
}

// ── Corazon brand colours (mirrors theme.css tokens) ─────────────────────────
const C = {
  crimson:     '#6E1216',
  crimsonDark: '#5A0D10',
  crimsonDeep: '#3D0A0C',
  gold:        '#C8890A',
  goldBright:  '#E8A800',
  cream:       '#FBF7F1',
  creamMuted:  '#F0E6D8',
  textDark:    '#2A1215',
  textMuted:   '#7A5C50',
  border:      '#E8D8C8',
};

export function LoginScreen({ onLogin, initialView = 'login', sessionEmail }: LoginScreenProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [role, setRole] = useState<'admin' | 'employee'>('admin');
  const [email, setEmail] = useState(initialView === 'session-expired' ? (sessionEmail ?? '') : '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(role); }, 1200);
  }

  function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resetEmail) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setResetSent(true); }, 1000);
  }

  const inputCls = `w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-[${C.textMuted}]/60 border`;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: C.crimsonDeep }}
    >
      {/* Background — radial glow & subtle pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large gold glow top-left */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, ${C.goldBright}22 0%, transparent 65%)` }} />
        {/* Crimson glow bottom-right */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, ${C.crimson}99 0%, transparent 65%)` }} />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
        {/* Gold horizontal streak */}
        <div className="absolute top-1/3 left-0 right-0 h-px opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${C.goldBright}, transparent)` }} />
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-[420px] rounded-2xl overflow-hidden"
        style={{
          background: C.cream,
          boxShadow: `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,137,10,0.2)`,
        }}
      >
        {/* Gold top accent bar */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldBright}, ${C.gold})` }} />

        {/* Session expired banner */}
        {view === 'session-expired' && (
          <div className="flex items-center gap-3 px-6 py-3.5 bg-amber-50 border-b border-amber-200">
            <AlertTriangle size={15} className="text-amber-700 flex-shrink-0" />
            <p className="text-xs text-amber-900 font-semibold">Your session has expired. Please log in again.</p>
          </div>
        )}

        <div className="px-9 pt-8 pb-7">
          {view === 'forgot-password' ? (
            <ForgotPassword
              resetEmail={resetEmail} setResetEmail={setResetEmail}
              resetSent={resetSent} loading={loading}
              onSubmit={handleResetSubmit}
              onBack={() => { setView('login'); setResetSent(false); setResetEmail(''); }}
              inputCls={inputCls}
            />
          ) : (
            <>
              {/* Logo */}
              <div className="flex flex-col items-center mb-7">
                <div
                  className="rounded-2xl overflow-hidden mb-4 flex items-center justify-center"
                  style={{ background: C.crimson, padding: '10px 18px', boxShadow: `0 6px 20px ${C.crimson}88` }}
                >
                  <ImageWithFallback
                    src={corazonLogo}
                    alt="Corazon Travel and Tours"
                    className="h-14 w-auto object-contain"
                  />
                </div>
                <p className="text-sm font-semibold mt-0.5" style={{ color: C.textMuted }}>
                  HR Management System
                </p>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  {view === 'session-expired' ? 'Sign in to continue your session' : 'Sign in to your account'}
                </p>
              </div>

              {/* Role selector */}
              <div
                className="flex rounded-xl p-1 mb-6 gap-1"
                style={{ background: C.creamMuted, border: `1px solid ${C.border}` }}
              >
                {(['admin', 'employee'] as const).map(r => (
                  <button
                    key={r} type="button" onClick={() => setRole(r)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
                    style={role === r
                      ? { background: C.crimson, color: '#FFF5E9', boxShadow: `0 2px 10px ${C.crimson}55` }
                      : { color: C.textMuted }
                    }
                  >
                    {r === 'admin' ? 'Admin / HR' : 'Employee'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.textDark }}>Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder={role === 'admin' ? 'admin@corazontraveltours.ph' : 'employee@corazontraveltours.ph'}
                      readOnly={view === 'session-expired'}
                      autoComplete="email"
                      className={inputCls}
                      style={{
                        background: view === 'session-expired' ? C.creamMuted : '#FFFFFF',
                        borderColor: C.border,
                        color: C.textDark,
                      }}
                      onFocus={e => (e.target.style.borderColor = C.gold)}
                      onBlur={e => (e.target.style.borderColor = C.border)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.textDark }}>Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
                    <input
                      type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={inputCls + ' pr-11'}
                      style={{ background: '#FFFFFF', borderColor: C.border, color: C.textDark }}
                      onFocus={e => (e.target.style.borderColor = C.gold)}
                      onBlur={e => (e.target.style.borderColor = C.border)}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: C.textMuted }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5 font-semibold">
                    <AlertTriangle size={13} /> {error}
                  </p>
                )}

                {/* Remember me + forgot */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => setRememberMe(v => !v)}
                      className="w-4 h-4 rounded flex items-center justify-center border-2 transition-all cursor-pointer"
                      style={rememberMe
                        ? { background: C.gold, borderColor: C.gold }
                        : { borderColor: C.border, background: '#fff' }
                      }
                    >
                      {rememberMe && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: C.textMuted }}>Remember me</span>
                  </label>
                  <button type="button" onClick={() => setView('forgot-password')}
                    className="text-xs font-bold transition-colors"
                    style={{ color: C.gold }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.goldBright)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.gold)}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Sign in button */}
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all mt-2 flex items-center justify-center gap-2"
                  style={{
                    background: loading
                      ? C.textMuted
                      : `linear-gradient(135deg, ${C.crimson}, ${C.crimsonDark})`,
                    color: '#FFF5E9',
                    boxShadow: loading ? 'none' : `0 6px 20px ${C.crimson}55`,
                  }}
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                  ) : (
                    view === 'session-expired' ? 'Log In Again' : 'Sign In'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-9 py-4 border-t" style={{ borderColor: C.border, background: C.creamMuted }}>
          <p className="text-center text-[11px] font-semibold" style={{ color: C.textMuted }}>
            © 2026 Corazon Travel and Tours · All rights reserved
          </p>
        </div>
      </div>

      {/* Sub-label */}
      <p className="mt-6 text-xs font-semibold" style={{ color: 'rgba(255,235,180,0.35)' }}>
        Taguig City, Philippines
      </p>
    </div>
  );
}

// ── Forgot Password ───────────────────────────────────────────────────────────

function ForgotPassword({
  resetEmail, setResetEmail, resetSent, loading, onSubmit, onBack, inputCls,
}: {
  resetEmail: string; setResetEmail: (v: string) => void;
  resetSent: boolean; loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  inputCls: string;
}) {
  if (resetSent) {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: C.textDark }}>Check Your Email</h2>
        <p className="text-sm mb-1" style={{ color: C.textMuted }}>A password reset link has been sent to:</p>
        <p className="text-sm font-bold mb-6" style={{ color: C.textDark }}>{resetEmail}</p>
        <p className="text-xs mb-6" style={{ color: C.textMuted }}>Didn't receive it? Check your spam folder or try again in a few minutes.</p>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold transition-colors" style={{ color: C.gold }}>
          <ArrowLeft size={15} /> Back to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center mb-7">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: `${C.gold}20`, border: `2px solid ${C.gold}40` }}>
          <Lock size={24} style={{ color: C.gold }} />
        </div>
        <h2 className="text-xl font-bold text-center" style={{ color: C.textDark }}>Reset Password</h2>
        <p className="text-sm mt-1.5 text-center leading-relaxed" style={{ color: C.textMuted }}>
          Enter your registered email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: C.textDark }}>Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
            <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
              placeholder="Enter your registered email" autoFocus required
              className={inputCls}
              style={{ background: '#FFFFFF', borderColor: C.border, color: C.textDark }}
              onFocus={e => (e.target.style.borderColor = C.gold)}
              onBlur={e => (e.target.style.borderColor = C.border)}
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !resetEmail}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          style={{
            background: loading || !resetEmail ? C.textMuted : `linear-gradient(135deg, ${C.crimson}, ${C.crimsonDark})`,
            color: '#FFF5E9',
            boxShadow: loading || !resetEmail ? 'none' : `0 6px 20px ${C.crimson}55`,
          }}
        >
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
            : <><Send size={15} /> Send Reset Link</>
          }
        </button>
      </form>

      <button onClick={onBack}
        className="w-full flex items-center justify-center gap-2 mt-4 text-sm font-semibold transition-colors"
        style={{ color: C.textMuted }}
        onMouseEnter={e => (e.currentTarget.style.color = C.textDark)}
        onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
      >
        <ArrowLeft size={15} /> Back to Login
      </button>
    </>
  );
}

