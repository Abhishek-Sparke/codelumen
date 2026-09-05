import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Sparkles, Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../../types';
import { CodeSparkLogo } from '../brand/CodeSparkLogo';
import { StorageService } from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: Partial<UserProfile>) => void;
  onOpenOnboarding: () => void;
  initialMode?: 'login' | 'signup';
  isFullScreen?: boolean;
  onNavigateHome?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenOnboarding,
  initialMode = 'login',
  isFullScreen = false,
  onNavigateHome
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen && !isFullScreen) return null;

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setAuthError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      if (!username.trim() || username.length < 3) {
        setAuthError('Username must be at least 3 characters long.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setAuthError('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setAuthError('Password must be at least 6 characters.');
        return;
      }

      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        const res = StorageService.registerUser({
          name: name.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          password
        });

        if (!res.success || !res.user) {
          setAuthError(res.error || 'Failed to create account.');
          return;
        }

        onSuccess(res.user);
        if (!isFullScreen) onClose();
        onOpenOnboarding();
      }, 350);
    } else {
      // Login
      if (!email.trim()) {
        setAuthError('Please enter your email or username.');
        return;
      }
      if (!password) {
        setAuthError('Please enter your password.');
        return;
      }

      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        const res = StorageService.loginUser(email.trim(), password);
        if (!res.success || !res.user) {
          setAuthError(res.error || 'Invalid credentials.');
          return;
        }

        onSuccess(res.user);
        if (!isFullScreen) onClose();
        if (!res.user.onboarding_completed) {
          onOpenOnboarding();
        }
      }, 350);
    }
  };

  const handleStartGoogleAuth = () => {
    setAuthError('');
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowGoogleChooser(true);
    }, 400);
  };

  const handleSelectGoogleAccount = (account: { name: string; email: string; avatar?: string }) => {
    setShowGoogleChooser(false);
    setIsConnecting(true);

    setTimeout(() => {
      setIsConnecting(false);
      const username = account.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      
      const res = StorageService.loginUser(account.email);
      let userObj: Partial<UserProfile>;
      let isNew = false;

      if (res.success && res.user) {
        userObj = res.user;
      } else {
        const reg = StorageService.registerUser({
          name: account.name,
          username,
          email: account.email,
          avatar: account.avatar
        });
        userObj = reg.user || {
          email: account.email,
          name: account.name,
          username,
          avatar: account.avatar,
          onboarding_completed: false
        };
        isNew = true;
      }

      onSuccess(userObj);

      if (!isFullScreen) {
        onClose();
      }

      if (isNew || !userObj.onboarding_completed) {
        onOpenOnboarding();
      }
    }, 400);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.includes('@')) {
      setAuthError('Please enter a valid Google email address.');
      return;
    }
    const derivedName = customGoogleName || customGoogleEmail.split('@')[0];
    handleSelectGoogleAccount({
      name: derivedName,
      email: customGoogleEmail,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
    });
  };

  const content = (
    <div className="w-full max-w-[500px] mx-auto text-left">
      {/* Header when rendered in full screen */}
      {isFullScreen && (
        <header className="mb-8 flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <CodeSparkLogo size="sm" animate={true} />
          </div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              ← Back to home
            </button>
          )}
        </header>
      )}

      {/* Hero Tagline */}
      <p className="mb-6 text-center text-sm sm:text-base font-bold text-white/90">
        Master Algorithms. <span className="text-amber-400">One Problem at a Time.</span>
      </p>

      {/* Main Auth Card */}
      <div className="overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)]">
        {/* Auth Switch Tabs (Sign In / Sign Up) */}
        <nav className="grid grid-cols-2 p-1.5 gap-1.5 border-b border-white/[0.08] bg-white/[0.02]" aria-label="Account access">
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className={`flex items-center justify-center py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all ${
              mode === 'login'
                ? 'bg-white/[0.08] text-white shadow-sm border border-white/[0.1]'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('signup')}
            className={`flex items-center justify-center py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all ${
              mode === 'signup'
                ? 'bg-white/[0.08] text-white shadow-sm border border-white/[0.1]'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
            }`}
          >
            Sign up
          </button>
        </nav>

        {/* Card Content */}
        <div className="p-6 sm:p-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-400/90">
            {mode === 'signup' ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}
          </p>

          <h1 className="mb-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {mode === 'signup' ? 'Create your account' : 'Sign in to CodeSpark'}
          </h1>

          <p className="mb-6 text-xs sm:text-sm leading-relaxed text-white/60">
            {mode === 'signup'
              ? 'Master data structures and algorithms with deliberate practice, visual testcases, and an intelligent AI coach.'
              : 'Your problems, your coding streaks, and your next algorithmic breakthrough. Pick up where you left off.'}
          </p>

          {authError && (
            <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
              {authError}
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3.5 mb-5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Developer"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      placeholder="alex_dev"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                {mode === 'signup' ? 'Email Address' : 'Email or Username'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type={mode === 'signup' ? 'email' : 'text'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'signup' ? 'alex@example.com' : 'alex@example.com or @alex_dev'}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isConnecting}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Processing…</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#0c0c11] px-2 text-white/40 font-semibold tracking-wider">or</span>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleStartGoogleAuth}
            disabled={isConnecting}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.14] bg-white hover:bg-slate-100 px-5 py-3 text-xs font-bold text-gray-900 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-wait"
          >
            {/* Official Google G Icon */}
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.32 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Security Reassurance */}
          <p className="mt-3.5 mb-4 text-center text-[11px] text-white/50 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Secure 256-bit encrypted authentication</span>
          </p>

          {/* Alternate Switcher */}
          <p className="mt-4 text-center text-xs text-white/50">
            {mode === 'signup' ? 'Already have an account?' : 'Don’t have an account?'}{' '}
            <button
              type="button"
              onClick={() => handleModeSwitch(mode === 'signup' ? 'login' : 'signup')}
              className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 ml-1"
            >
              {mode === 'signup' ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>

      {/* Footer Browse link */}
      <p className="mt-5 text-center text-xs text-white/45">
        Just exploring?{' '}
        <button
          onClick={() => {
            if (onClose) onClose();
            if (onNavigateHome) onNavigateHome();
          }}
          className="font-semibold text-white/70 hover:text-white underline underline-offset-4"
        >
          Explore problems & algorithms →
        </button>
      </p>
    </div>
  );

  // If used as full page screen
  if (isFullScreen) {
    return (
      <main className="min-h-screen bg-[#09090c] text-white py-12 px-4 flex items-center justify-center">
        {content}

        {/* Google OAuth Account Chooser Modal */}
        {showGoogleChooser && (
          <GoogleAccountChooserModal
            onClose={() => setShowGoogleChooser(false)}
            onSelectAccount={handleSelectGoogleAccount}
            customName={customGoogleName}
            setCustomName={setCustomGoogleName}
            customEmail={customGoogleEmail}
            setCustomEmail={setCustomGoogleEmail}
            showCustomInput={showCustomInput}
            setShowCustomInput={setShowCustomInput}
            onCustomSubmit={handleCustomGoogleSubmit}
          />
        )}
      </main>
    );
  }

  // Modal dialog overlay
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[480px] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all shadow-md"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {content}
      </div>

      {/* Google OAuth Account Chooser Modal */}
      {showGoogleChooser && (
        <GoogleAccountChooserModal
          onClose={() => setShowGoogleChooser(false)}
          onSelectAccount={handleSelectGoogleAccount}
          customName={customGoogleName}
          setCustomName={setCustomGoogleName}
          customEmail={customGoogleEmail}
          setCustomEmail={setCustomGoogleEmail}
          showCustomInput={showCustomInput}
          setShowCustomInput={setShowCustomInput}
          onCustomSubmit={handleCustomGoogleSubmit}
        />
      )}
    </div>
  );
};

// =============================================================================
// GOOGLE ACCOUNT CHOOSER (SIMULATED OAUTH MODAL)
// =============================================================================
interface GoogleChooserProps {
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string; avatar?: string }) => void;
  customName: string;
  setCustomName: (v: string) => void;
  customEmail: string;
  setCustomEmail: (v: string) => void;
  showCustomInput: boolean;
  setShowCustomInput: (v: boolean) => void;
  onCustomSubmit: (e: React.FormEvent) => void;
}

const GoogleAccountChooserModal: React.FC<GoogleChooserProps> = ({
  onClose,
  onSelectAccount,
  customName,
  setCustomName,
  customEmail,
  setCustomEmail,
  showCustomInput,
  setShowCustomInput,
  onCustomSubmit
}) => {
  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-2xl border border-white/20 bg-[#121218] p-6 text-left shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.32 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span className="text-sm font-semibold text-white/90">Sign in with Google</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">Choose an account</h3>
        <p className="text-xs text-white/50 mb-5">to continue to <span className="text-amber-400 font-semibold">CodeSpark</span></p>

        {/* Google Accounts */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onSelectAccount({
              name: 'Abhishek Sparke',
              email: 'abhishek.sparke@gmail.com',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            })}
            className="flex w-full items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-all hover:bg-white/[0.08] hover:border-amber-400/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 font-bold text-black text-sm">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Abhishek Sparke</p>
              <p className="text-[11px] text-white/50 truncate">abhishek.sparke@gmail.com</p>
            </div>
            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Active
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectAccount({
              name: 'Ada Okonkwo',
              email: 'ada.okonkwo@gmail.com',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            })}
            className="flex w-full items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-all hover:bg-white/[0.08] hover:border-amber-400/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-black text-sm">
              AO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Ada Okonkwo</p>
              <p className="text-[11px] text-white/50 truncate">ada.okonkwo@gmail.com</p>
            </div>
          </button>

          {/* Use another Google account toggle */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="flex w-full items-center gap-3.5 rounded-xl border border-dashed border-white/15 p-3 text-left transition-all hover:bg-white/[0.03] text-white/70 hover:text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">Use another Google account</span>
            </button>
          ) : (
            <form onSubmit={onCustomSubmit} className="mt-3 rounded-xl border border-white/15 bg-white/[0.02] p-3 space-y-2.5">
              <p className="text-[11px] font-semibold text-white/80">Enter Google Account Details</p>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Full Name (e.g. Linus Torvalds)"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400"
              />
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-3 py-1.5 text-xs text-white/50 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-amber-300 transition-colors"
                >
                  Continue with this Account
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Permissions disclosure */}
        <p className="mt-5 text-[10px] text-white/40 leading-relaxed">
          To continue, Google will share your name, email address, language preference, and profile picture with CodeSpark. See CodeSpark’s{' '}
          <span className="text-amber-400 underline">Privacy Policy</span> and{' '}
          <span className="text-amber-400 underline">Terms of Service</span>.
        </p>
      </div>
    </div>
  );
};
