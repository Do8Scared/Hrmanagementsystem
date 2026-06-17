import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertTriangle, Building2, Send } from 'lucide-react';

type AuthView = 'login' | 'forgot-password' | 'session-expired';

interface LoginScreenProps {
  onLogin: (role: 'admin' | 'employee') => void;
  initialView?: AuthView;
  sessionEmail?: string;
}

export function LoginScreen({ onLogin, initialView = 'login', sessionEmail }: LoginScreenProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [role, setRole] = useState<'admin' | 'employee'>('admin');
  const [email, setEmail] = useState(initialView === 'session-expired' ? (sessionEmail ?? 'juan.delacruz@hrms.ph') : '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(role);
    }, 1200);
  }

  function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resetEmail) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
    }, 1000);
  }

  const inputCls = "w-full pl-10 pr-4 py-3 bg-[#F7F8FA] border border-[#E8EAF0] rounded-xl text-sm text-[#1E2A4A] outline-none focus:border-[#1E2A4A]/40 focus:ring-2 focus:ring-[#1E2A4A]/10 transition-all placeholder:text-[#9CA3AF]";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#1E2A4A' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white/3" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-[440px] bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: '0 25px 60px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)',
        }}
      >
        {/* Session expired banner */}
        {view === 'session-expired' && (
          <div className="flex items-center gap-3 px-6 py-3.5 bg-amber-50 border-b border-amber-200">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-medium">Your session has expired. Please log in again.</p>
          </div>
        )}

        <div className="px-10 pt-9 pb-8">
          {view === 'forgot-password' ? (
            <ForgotPassword
              resetEmail={resetEmail}
              setResetEmail={setResetEmail}
              resetSent={resetSent}
              loading={loading}
              onSubmit={handleResetSubmit}
              onBack={() => { setView('login'); setResetSent(false); setResetEmail(''); }}
              inputCls={inputCls}
            />
          ) : (
            <>
              {/* Logo */}
              <div className="flex flex-col items-center mb-7">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{ background: '#1E2A4A' }}>
                  <Building2 size={28} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-[#1E2A4A] text-center">Corazon Travel and Tours</h1>
                <p className="text-sm text-[#6B7280] mt-1 text-center">
                  {view === 'session-expired' ? 'Sign in to continue your session' : 'Sign in to your account'}
                </p>
              </div>

              {/* Role Selector */}
              <div className="flex rounded-xl bg-[#F7F8FA] p-1 mb-6 gap-1">
                {(['admin', 'employee'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      role === r
                        ? 'text-white shadow-sm'
                        : 'text-[#6B7280] hover:text-[#1E2A4A]'
                    }`}
                    style={role === r ? { background: '#1E2A4A' } : {}}
                  >
                    {r === 'admin' ? 'Admin / HR' : 'Employee'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={role === 'admin' ? 'admin@hrms.ph' : 'employee@hrms.ph'}
                      className={inputCls + (view === 'session-expired' ? ' text-[#9CA3AF] bg-[#F0F0F0]' : '')}
                      readOnly={view === 'session-expired'}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={inputCls + ' pr-11'}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <AlertTriangle size={13} /> {error}
                  </p>
                )}

                {/* Remember me + forgot */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => setRememberMe(v => !v)}
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all cursor-pointer ${rememberMe ? 'border-[#1E2A4A]' : 'border-[#D1D5DB]'}`}
                      style={rememberMe ? { background: '#1E2A4A' } : {}}
                    >
                      {rememberMe && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <span className="text-xs text-[#6B7280]">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-xs font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all mt-2 flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{
                    background: loading ? '#374151' : '#1E2A4A',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(30,42,74,0.4)',
                  }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    view === 'session-expired' ? 'Log In Again' : 'Log In'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-4 border-t border-[#F3F4F6]">
          <p className="text-center text-[11px] text-[#9CA3AF]">
            © 2025 HR Management System. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative label */}
      <p className="mt-6 text-white/30 text-xs">
        HorizonHR Inc. · Taguig City, Philippines
      </p>
    </div>
  );
}

function ForgotPassword({
  resetEmail, setResetEmail, resetSent, loading, onSubmit, onBack, inputCls,
}: {
  resetEmail: string;
  setResetEmail: (v: string) => void;
  resetSent: boolean;
  loading: boolean;
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
        <h2 className="text-xl font-bold text-[#1E2A4A] mb-2">Check Your Email</h2>
        <p className="text-sm text-[#6B7280] mb-1">A password reset link has been sent to:</p>
        <p className="text-sm font-semibold text-[#1E2A4A] mb-6">{resetEmail}</p>
        <p className="text-xs text-[#9CA3AF] mb-6">Didn't receive it? Check your spam folder or try again in a few minutes.</p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors"
        >
          <ArrowLeft size={15} /> Back to Login
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center mb-7">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <Lock size={24} className="text-[#1E2A4A]" />
        </div>
        <h2 className="text-xl font-bold text-[#1E2A4A] text-center">Reset Password</h2>
        <p className="text-sm text-[#6B7280] mt-1.5 text-center leading-relaxed">
          Enter your registered email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              placeholder="Enter your registered email"
              className={inputCls}
              autoFocus
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !resetEmail}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            background: loading || !resetEmail ? '#9CA3AF' : '#1E2A4A',
            boxShadow: loading || !resetEmail ? 'none' : '0 4px 14px rgba(30,42,74,0.4)',
          }}
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
          ) : (
            <><Send size={15} /> Send Reset Link</>
          )}
        </button>
      </form>

      <button
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 mt-4 text-sm text-[#6B7280] hover:text-[#1E2A4A] transition-colors"
      >
        <ArrowLeft size={15} /> Back to Login
      </button>
    </>
  );
}
