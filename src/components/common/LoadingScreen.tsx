import React from 'react';
import { CodeSparkLogo } from '../brand/CodeSparkLogo';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Powering up your workspace…',
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#09090c] text-white ${
        fullScreen ? 'fixed inset-0 z-50' : 'w-full py-16'
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px]" />
      
      <div className="relative flex flex-col items-center gap-6">
        <CodeSparkLogo size="md" animate={true} />

        {/* Loading progress bar */}
        <div className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        <p className="text-xs font-medium tracking-wide text-white/50 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};
