import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  Play,
  Check,
  Shield,
  Plus,
  Radio
} from 'lucide-react';
import { UserProfile, Contest } from '../../../types';
import { SAMPLE_CONTESTS } from '../../../data/contests';

interface AdminContestsViewProps {
  currentUser: UserProfile;
}

export const AdminContestsView: React.FC<AdminContestsViewProps> = ({ currentUser }) => {
  const [contests, setContests] = useState<Contest[]>([...SAMPLE_CONTESTS]);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-3 text-white text-xs font-semibold shadow-2xl backdrop-blur-md">
          <Check className="h-4 w-4" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="h-6 w-6 text-amber-400" />
            Contest Arena Operations
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Schedule live contests, assign problem sets, and oversee real-time competitive tournaments.
          </p>
        </div>

        <button
          onClick={() => showToast('Contest creation form opened.')}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Schedule Contest
        </button>
      </div>

      {/* Live Contest Safeguard Notice */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs text-white/80">
          <strong className="text-red-400 font-semibold block mb-0.5">Live Contest Modification Safeguard</strong>
          Modifying problem sets, test suites, or point allocations during an active contest is strictly restricted. Any alteration directly impacts live leaderboard integrity and recalculates Elo ratings.
        </div>
      </div>

      {/* Contests List */}
      <div className="space-y-4">
        {contests.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h3 className="font-bold text-white text-base">{c.title}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  c.status === 'active'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                    : c.status === 'upcoming'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}>
                  {c.status === 'active' && '● LIVE '}
                  {c.status}
                </span>
              </div>

              <p className="text-xs text-white/60 mb-3 max-w-xl">
                {c.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-white/40" />
                  {c.durationMinutes} Minutes Duration
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-white/40" />
                  {c.participantsCount?.toLocaleString() || 0} Registered Competitors
                </span>
                <span className="font-mono text-white/60">
                  {c.problemIds?.length || 4} Problems Assigned
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => showToast(`Contest details for ${c.title}`)}
                className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
              >
                Inspect
              </button>
              {c.status === 'upcoming' && (
                <button
                  onClick={() => showToast(`Triggered early start for ${c.id}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  Start Arena
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
