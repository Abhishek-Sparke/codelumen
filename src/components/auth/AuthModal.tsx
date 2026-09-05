import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: Partial<UserProfile>) => void;
  onOpenOnboarding: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenOnboarding
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (mode !== 'forgot' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'forgot') {
      alert('Password reset link dispatched to ' + email);
      setMode('login');
      return;
    }

    if (mode === 'signup') {
      onSuccess({
        email,
        name: name || 'Practicing Developer',
        username: email.split('@')[0]
      });
      onClose();
      onOpenOnboarding();
    } else {
      onSuccess({
        email,
        name: name || 'Ada Okonkwo',
        username: email.split('@')[0]
      });
      onClose();
    }
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    onSuccess({
      email: `${provider}_user@example.com`,
      name: provider === 'github' ? 'GitHub Developer' : 'Google Explorer',
      username: `${provider}_coder`
    });
    onClose();
    if (mode === 'signup') onOpenOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] p-6 sm:p-8 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            {mode === 'signup' && 'Create your account'}
            {mode === 'login' && 'Welcome back'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="mt-1.5 text-xs text-white/50">
            {mode === 'signup' && 'Join thousands mastering algorithms through deliberate practice.'}
            {mode === 'login' && 'Pick up right where your coding streak left off.'}
            {mode === 'forgot' && 'Enter your registered email to receive recovery instructions.'}
          </p>
        </div>

        {/* OAuth Buttons */}
        {mode !== 'forgot' && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth('google')}
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.8 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.4-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              onClick={() => handleOAuth('github')}
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
            >
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        )}

        {mode !== 'forgot' && (
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-white/40">
              <span className="bg-[#0c0c11] px-3">or continue with email</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-center text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-medium text-white/60 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Okonkwo"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-3.5 w-3.5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-medium text-white/60">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-amber-400/80 hover:text-amber-300"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-3.5 w-3.5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20 transition-transform active:scale-[0.98]"
          >
            <span>
              {mode === 'signup' && 'Create Account & Continue'}
              {mode === 'login' && 'Sign In to Workspace'}
              {mode === 'forgot' && 'Send Reset Instructions'}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Bottom switcher */}
        <div className="mt-5 text-center text-xs text-white/50">
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="font-semibold text-amber-400 hover:underline">
                Sign In
              </button>
            </p>
          )}
          {mode === 'login' && (
            <p>
              Don’t have an account yet?{' '}
              <button onClick={() => setMode('signup')} className="font-semibold text-amber-400 hover:underline">
                Create One
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              Remembered your password?{' '}
              <button onClick={() => setMode('login')} className="font-semibold text-amber-400 hover:underline">
                Back to Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
