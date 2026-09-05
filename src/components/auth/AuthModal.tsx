import React, { useState } from 'react';
import { 
  X, ArrowRight, ShieldCheck, Sparkles, Loader2, 
  User, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, KeyRound
} from 'lucide-react';
import { UserProfile } from '../../types';
import { CodeSparkLogo } from '../brand/CodeSparkLogo';
import { StorageService } from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile, isNewUser: boolean) => void;
  initialMode?: 'login' | 'signup' | 'forgot';
  isFullScreen?: boolean;
  onNavigateHome?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  isFullScreen = false,
  onNavigateHome
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field validation touched states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  if (!isOpen && !isFullScreen) return null;

  const handleModeSwitch = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setAuthError('');
    setSuccessMessage('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  // Section 5: Real-time username validation
  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().trim();
    setUsername(clean);
    if (!clean) {
      setUsernameError('Username is required.');
    } else if (clean.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
    } else if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
      setUsernameError('Allowed characters: letters, numbers, and underscores.');
    } else if (!StorageService.checkUsernameAvailable(clean)) {
      setUsernameError('Username is already taken.');
    } else {
      setUsernameError('');
    }
  };

  // Section 5: Real-time email validation
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const clean = val.trim();
    if (!clean) {
      setEmailError('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setEmailError('Enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  // Section 5: Real-time password validation
  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (mode === 'signup') {
      if (!val) {
        setPasswordError('Password is required.');
      } else if (val.length < 8) {
        setPasswordError('Password must be at least 8 characters.');
      } else {
        setPasswordError('');
      }
      if (confirmPassword && val !== confirmPassword) {
        setConfirmPasswordError("Passwords don't match.");
      } else if (confirmPassword && val === confirmPassword) {
        setConfirmPasswordError('');
      }
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (val !== password) {
      setConfirmPasswordError("Passwords don't match.");
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMessage('');

    if (mode === 'forgot') {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setEmailError('Enter a valid email address.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const res = StorageService.sendPasswordResetEmail(email.trim());
        setSuccessMessage(res.message);
      }, 500);
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      if (!username.trim() || username.length < 3) {
        setUsernameError('Username must be at least 3 characters.');
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        setUsernameError('Allowed characters: letters, numbers, and underscores.');
        return;
      }
      if (!StorageService.checkUsernameAvailable(username.trim())) {
        setUsernameError('Username is already taken.');
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setEmailError('Enter a valid email address.');
        return;
      }
      if (!password || password.length < 8) {
        setPasswordError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords don't match.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await StorageService.registerUser({
          name: name.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          password
        });

        setIsSubmitting(false);
        if (!res.success || !res.user) {
          setAuthError(res.error || 'Failed to create account. Please try again.');
          return;
        }

        onSuccess(res.user, true);
        if (!isFullScreen) onClose();
      } catch (err) {
        setIsSubmitting(false);
        setAuthError('An unexpected error occurred. Please try again.');
      }
    } else {
      // Login
      if (!email.trim()) {
        setEmailError('Please enter your email or username.');
        return;
      }
      if (!password) {
        setPasswordError('Please enter your password.');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await StorageService.loginUser(email.trim(), password);
        setIsSubmitting(false);

        if (!res.success || !res.user) {
          setAuthError(res.error || 'Incorrect email or password. Please check your credentials and try again.');
          return;
        }

        onSuccess(res.user, false);
        if (!isFullScreen) onClose();
      } catch (err) {
        setIsSubmitting(false);
        setAuthError('An unexpected error occurred. Please try again.');
      }
    }
  };

  // Section 23: 2-Column Desktop Layout / Centered Mobile Layout
  const authFormCard = (
    <div className="w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)]">
        
        {/* Navigation Switch Tabs (Login / Signup) */}
        {mode !== 'forgot' && (
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
        )}

        <div className="p-6 sm:p-8">
          {/* Section 2 & 4 Headings */}
          {mode === 'login' && (
            <>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
                Welcome back to CodeSpark ⚡
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed">
                Continue your coding journey.
              </p>
            </>
          )}

          {mode === 'signup' && (
            <>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
                Start your CodeSpark journey ⚡
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed">
                Create your account and start building your coding skills.
              </p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="rounded-full p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Back to login"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold text-white/50">Return to Log In</span>
              </div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-white mb-1.5">
                Reset your password
              </h1>
              <p className="text-xs text-white/60 mb-6 leading-relaxed">
                Enter your registered email address and we&apos;ll send you instructions to reset your password.
              </p>
            </>
          )}

          {/* Error Message Display */}
          {authError && (
            <div className="mb-5 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2">
              <span className="font-bold">Error:</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Success Message Display */}
          {successMessage && (
            <div className="mb-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SIGNUP FIELDS */}
            {mode === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Taylor"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-white/70">
                      Username <span className="text-amber-400">*</span>
                    </label>
                    {usernameError && (
                      <span className="text-[11px] text-rose-400 font-medium">{usernameError}</span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="alex_taylor"
                      className={`w-full rounded-xl border bg-white/[0.04] pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none ${
                        usernameError ? 'border-rose-500/50' : 'border-white/10 focus:border-amber-400'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white/70">
                  {mode === 'signup' || mode === 'forgot' ? 'Email Address' : 'Email or Username'} <span className="text-amber-400">*</span>
                </label>
                {emailError && (
                  <span className="text-[11px] text-rose-400 font-medium">{emailError}</span>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type={mode === 'signup' || mode === 'forgot' ? 'email' : 'text'}
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder={mode === 'signup' || mode === 'forgot' ? 'alex@example.com' : 'alex@example.com or @alex_taylor'}
                  className={`w-full rounded-xl border bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none ${
                    emailError ? 'border-rose-500/50' : 'border-white/10 focus:border-amber-400'
                  }`}
                />
              </div>
            </div>

            {/* Password (for Login and Signup) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-white/70">
                    Password <span className="text-amber-400">*</span>
                  </label>
                  {mode === 'login' ? (
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('forgot')}
                      className="text-[11px] font-medium text-amber-400/90 hover:text-amber-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  ) : (
                    passwordError && (
                      <span className="text-[11px] text-rose-400 font-medium">{passwordError}</span>
                    )
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl border bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none ${
                      passwordError ? 'border-rose-500/50' : 'border-white/10 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (for Signup) */}
            {mode === 'signup' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-white/70">
                    Confirm Password <span className="text-amber-400">*</span>
                  </label>
                  {confirmPasswordError && (
                    <span className="text-[11px] text-rose-400 font-medium">{confirmPasswordError}</span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl border bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none ${
                      confirmPasswordError ? 'border-rose-500/50' : 'border-white/10 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 p-1"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Primary Action Button with Section 21 loading states */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>
                    {mode === 'signup' ? 'Creating account...' : mode === 'forgot' ? 'Sending reset link...' : 'Logging in...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signup' ? 'Create Account →' : mode === 'forgot' ? 'Send Reset Link →' : 'Log In →'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Section 6 & 24 Security badge */}
          <p className="mt-5 text-center text-[11px] text-white/45 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Encrypted with client-side SHA-256 cryptographic security</span>
          </p>

          {/* Bottom Switcher */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] text-center text-xs text-white/55">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 ml-1"
                >
                  Log in
                </button>
              </p>
            ) : mode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 ml-1"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 ml-1"
                >
                  Back to Log In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Section 23: 2-Column Desktop Layout
  const fullContent = (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column (Desktop branding & marketing) */}
        <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <CodeSparkLogo size="md" animate={true} />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15] mb-4">
            Ignite your <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              coding skills.
            </span>
          </h2>

          <p className="text-sm sm:text-base font-medium text-amber-300/80 mb-6">
            &ldquo;Learn. Practice. Solve.&rdquo;
          </p>

          <p className="text-xs sm:text-sm leading-relaxed text-white/60 max-w-lg mb-8">
            CodeSpark delivers deliberate algorithmic practice. Master patterns, receive Socratic AI guidance, and track your daily streak with genuine earned milestones.
          </p>

          <div className="hidden lg:flex flex-col gap-3.5 border-t border-white/[0.08] pt-6">
            <div className="flex items-center gap-3 text-xs text-white/70">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span>Structured curriculum roadmaps tailored to your target</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/70">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span>Zero fake statistics — every point and streak is earned</span>
            </div>
          </div>
        </div>

        {/* Right Column (Authentication card) */}
        <div className="lg:col-span-6 flex justify-center">
          {authFormCard}
        </div>

      </div>
    </div>
  );

  // Full Screen view
  if (isFullScreen) {
    return (
      <main className="min-h-screen bg-[#09090c] text-white flex flex-col justify-center items-center py-12 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />

        {/* Top bar with back to home */}
        <div className="w-full max-w-5xl px-4 flex items-center justify-between mb-4">
          <div className="lg:hidden">
            <CodeSparkLogo size="sm" animate={true} />
          </div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-white/60 hover:text-white transition-colors ml-auto"
            >
              ← Back to home
            </button>
          )}
        </div>

        {fullContent}
      </main>
    );
  }

  // Modal Dialog view
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all shadow-md"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {authFormCard}
      </div>
    </div>
  );
};
