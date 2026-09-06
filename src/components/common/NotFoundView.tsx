import React from 'react';
import { AlertCircle, ArrowLeft, Compass, Code, MessageSquare, Home } from 'lucide-react';
import { Link } from '../../router/Link';

interface NotFoundViewProps {
  type?: 'page' | 'problem' | 'discussion' | 'category' | 'profile';
  identifier?: string;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  type = 'page',
  identifier
}) => {
  const getTitle = () => {
    switch (type) {
      case 'problem':
        return 'Problem Not Found';
      case 'discussion':
        return 'Discussion Not Found';
      case 'category':
        return 'Category Not Found';
      case 'profile':
        return 'User Profile Not Found';
      default:
        return 'Page Not Found';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'problem':
        return identifier
          ? `We couldn't find an algorithmic problem matching "${identifier}". It may have been renamed or unpublished.`
          : `The requested problem does not exist or has been removed.`;
      case 'discussion':
        return identifier
          ? `We couldn't find a community discussion matching "${identifier}".`
          : `The requested discussion thread does not exist or has been removed.`;
      case 'category':
        return identifier
          ? `Discussion category "${identifier}" was not found.`
          : `The requested category does not exist.`;
      case 'profile':
        return identifier
          ? `No developer profile was found with the username or ID "${identifier}".`
          : `The requested user profile does not exist.`;
      default:
        return `The URL you visited does not exist on CodeSpark. Please check the address or return to the problem library.`;
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-200">
        
        {/* Glowing badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/10 border border-amber-400/20 text-amber-400 shadow-xl shadow-amber-400/5">
          <Compass className="h-10 w-10 animate-pulse" />
        </div>

        {/* Status code & title */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            404 — Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {getTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
            {getMessage()}
          </p>
        </div>

        {/* Action options */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/problems"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-md shadow-amber-400/10"
          >
            <Code className="h-4 w-4 stroke-[2.5]" />
            <span>Problem Library</span>
          </Link>

          <Link
            href="/discussions"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Discussions</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/60 hover:bg-white/[0.08] hover:text-white transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
