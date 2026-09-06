import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { UserProfile } from '../../types';
import { Link } from '../../router/Link';

interface AdminAccessDeniedProps {
  currentUser: UserProfile | null;
}

export const AdminAccessDenied: React.FC<AdminAccessDeniedProps> = ({
  currentUser
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-[#0d0d14]/90 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-inner">
          <ShieldAlert className="h-8 w-8 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Lock className="h-3 w-3" />
          403 Access Denied
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Restricted Platform Area
        </h1>

        <p className="text-sm text-white/60 mb-6 leading-relaxed">
          {currentUser ? (
            <>
              You are signed in as <span className="text-white font-medium">@{currentUser.username}</span> with role <span className="font-semibold text-amber-400 uppercase">{currentUser.role || 'user'}</span>. This administrative console strictly requires <strong>Administrator</strong> or <strong>Moderator</strong> privileges.
            </>
          ) : (
            <>
              Authentication is required to access the CodeSpark Platform Control Center. Please log in with an administrative or moderator account.
            </>
          )}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-xs text-white/40">
          Zero-Trust Security Policy • Incident logged to immutable audit trail
        </div>
      </div>
    </div>
  );
};
