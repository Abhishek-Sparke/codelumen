import React, { useState } from 'react';
import { X, Code2, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Loader2, User } from 'lucide-react';
import { UserProfile } from '../../types';

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

  if (!isOpen && !isFullScreen) return null;

  const handleStartGoogleAuth = () => {
    setAuthError('');
    setIsConnecting(true);

    // Simulate standard Google OAuth popup latency
    setTimeout(() => {
      setIsConnecting(false);
      setShowGoogleChooser(true);
    }, 450);
  };

  const handleSelectGoogleAccount = (account: { name: string; email: string; avatar?: string }) => {
    setShowGoogleChooser(false);
    setIsConnecting(true);

    setTimeout(() => {
      setIsConnecting(false);
      const username = account.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      
      onSuccess({
        email: account.email,
        name: account.name,
        username: username,
        avatar: account.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
      });

      if (!isFullScreen) {
        onClose();
      }

      if (mode === 'signup') {
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
      {/* Skillshot-style Header when rendered in full screen */}
      {isFullScreen && (
        <header className="mb-8 flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-white/5 to-cyan-500/20 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0f0f14]">
                <Code2 className="h-4.5 w-4.5 text-amber-400" />
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-[0.16em] text-white">CODELUMEN</span>
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
            onClick={() => setMode('login')}
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
            onClick={() => setMode('signup')}
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
            {mode === 'signup' ? 'Create your account' : 'Sign in to CodeLumen'}
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

          {/* Google Auth Button (Primary Authentication Method) */}
          <button
            type="button"
            onClick={handleStartGoogleAuth}
            disabled={isConnecting}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-white/[0.16] bg-white hover:bg-slate-100 px-5 py-3.5 text-sm font-bold text-gray-900 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-wait"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-gray-700" />
                <span>Connecting to Google…</span>
              </>
            ) : (
              <>
                {/* Official Google G Icon */}
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.32 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
              </>
            )}
          </button>

          {/* Security Reassurance */}
          <p className="mt-3.5 mb-5 text-center text-xs text-white/50 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Secure Google sign-in. No extra password to remember.</span>
          </p>

          {/* Explanation Box */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-xs leading-relaxed text-white/65">
            {mode === 'signup'
              ? 'Your first Google sign-in creates your CodeLumen account automatically. Then you can personalize your profile and start practicing.'
              : 'New to CodeLumen? Your first Google sign-in also creates your account automatically with your progress saved.'}
          </div>

          {/* Alternate Switcher */}
          <p className="mt-6 text-center text-xs text-white/50">
            {mode === 'signup' ? 'Already have an account?' : 'Don’t have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
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
            customEmail={customGoogleEmail}
            setCustomEmail={setCustomGoogleEmail}
            customName={customGoogleName}
            setCustomName={setCustomGoogleName}
            showCustomInput={showCustomInput}
            setShowCustomInput={setShowCustomInput}
            onCustomSubmit={handleCustomGoogleSubmit}
          />
        )}
      </main>
    );
  }

  // If used as modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {content}

        {/* Google OAuth Account Chooser Modal */}
        {showGoogleChooser && (
          <GoogleAccountChooserModal
            onClose={() => setShowGoogleChooser(false)}
            onSelectAccount={handleSelectGoogleAccount}
            customEmail={customGoogleEmail}
            setCustomEmail={setCustomGoogleEmail}
            customName={customGoogleName}
            setCustomName={setCustomGoogleName}
            showCustomInput={showCustomInput}
            setShowCustomInput={setShowCustomInput}
            onCustomSubmit={handleCustomGoogleSubmit}
          />
        )}
      </div>
    </div>
  );
};

// Authentic Google Account Chooser Dialog
interface GoogleChooserProps {
  onClose: () => void;
  onSelectAccount: (acc: { name: string; email: string; avatar?: string }) => void;
  customEmail: string;
  setCustomEmail: (v: string) => void;
  customName: string;
  setCustomName: (v: string) => void;
  showCustomInput: boolean;
  setShowCustomInput: (v: boolean) => void;
  onCustomSubmit: (e: React.FormEvent) => void;
}

const GoogleAccountChooserModal: React.FC<GoogleChooserProps> = ({
  onClose,
  onSelectAccount,
  customEmail,
  setCustomEmail,
  customName,
  setCustomName,
  showCustomInput,
  setShowCustomInput,
  onCustomSubmit
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[#1e1f24] border border-white/15 p-6 shadow-2xl text-left">
        {/* Google Header */}
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
        <p className="text-xs text-white/50 mb-5">to continue to <span className="text-amber-400 font-semibold">CodeLumen</span></p>

        {/* Existing / Primary Google Account */}
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
          To continue, Google will share your name, email address, language preference, and profile picture with CodeLumen. See CodeLumen’s{' '}
          <span className="text-amber-400 underline">Privacy Policy</span> and{' '}
          <span className="text-amber-400 underline">Terms of Service</span>.
        </p>
      </div>
    </div>
  );
};
