import React, { useState, useEffect } from 'react';
import { 
  Trophy, Clock, Play, Users, CheckCircle2, 
  ArrowRight, Award, AlertCircle 
} from 'lucide-react';
import { Contest } from '../../types';
import { SAMPLE_CONTESTS } from '../../data/contests';
import { ALL_PROBLEMS } from '../../data/problems';

interface ContestsViewProps {
  onNavigateProblem: (problemId: string) => void;
}

export const ContestsView: React.FC<ContestsViewProps> = ({
  onNavigateProblem
}) => {
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5340); // ~1h 29m countdown

  useEffect(() => {
    if (!selectedContest || selectedContest.status !== 'active') return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedContest]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const contestProblems = selectedContest ? selectedContest.problemIds.map((id, idx) => {
    const p = ALL_PROBLEMS.find(prob => prob.id === id);
    return { problem: p, score: (idx + 1) * 100 };
  }).filter(item => item.problem !== undefined) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div>
        <span className="lumen-tag text-purple-400">Timed Arena</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Contests
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-white/50 max-w-2xl leading-relaxed">
          Test your algorithmic agility under real interview pressure. Compete against global developers in timed 90-minute challenges.
        </p>
      </div>

      {/* ACTIVE CONTEST ROOM (If entered) */}
      {selectedContest ? (
        <div className="glass-panel rounded-3xl p-6 sm:p-9 border border-amber-500/30 bg-[#0c0c11] space-y-8 animate-in fade-in duration-200">
          
          {/* Contest Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Live Contest In Progress
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                {selectedContest.title}
              </h2>
              <p className="text-xs text-white/50 mt-1">{selectedContest.description}</p>
            </div>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-5 py-3">
              <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/70 block">Time Remaining</span>
                <span className="font-mono text-xl font-bold text-amber-300">
                  {formatTimer(secondsRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Contest Problems List */}
          <div>
            <h3 className="font-display text-base font-bold text-white mb-4">
              Contest Problem Set (4 Questions)
            </h3>

            <div className="space-y-3">
              {contestProblems.map(({ problem, score }, idx) => {
                if (!problem) return null;
                return (
                  <div
                    key={problem.id}
                    onClick={() => onNavigateProblem(problem.id)}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4.5 cursor-pointer hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-bold text-amber-400">
                        Q{idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-sm text-white">
                          {problem.title}
                        </span>
                        <span className="block text-[11px] text-white/40">
                          {problem.pattern} · {problem.topic}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {score} pts
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <ArrowRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-between items-center text-xs">
            <span className="text-white/40">2,890 participating developers</span>
            <button
              onClick={() => setSelectedContest(null)}
              className="rounded-xl border border-white/10 px-4 py-2 text-white/60 hover:text-white"
            >
              Exit Contest Room
            </button>
          </div>

        </div>
      ) : (
        /* CONTESTS CATALOG */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_CONTESTS.map((contest) => {
            const isActive = contest.status === 'active';
            const isUpcoming = contest.status === 'upcoming';

            return (
              <div
                key={contest.id}
                className={`glass-panel flex flex-col justify-between rounded-3xl p-6 sm:p-7 border transition-all ${
                  isActive 
                    ? 'border-amber-400/40 bg-gradient-to-b from-amber-500/10 to-transparent shadow-lg shadow-amber-500/10' 
                    : 'border-white/[0.08]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isActive 
                        ? 'bg-amber-400 text-black' 
                        : isUpcoming 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                        : 'bg-white/5 text-white/40'
                    }`}>
                      {contest.status}
                    </span>
                    <span className="text-xs text-white/40 font-mono">
                      {contest.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-white leading-snug">
                    {contest.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    {contest.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>{contest.startTime}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-white/40">
                    {contest.participantsCount} participants
                  </span>

                  <button
                    onClick={() => setSelectedContest(contest)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-transform active:scale-95 ${
                      isActive
                        ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20 hover:bg-amber-300'
                        : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {isActive ? 'Enter Contest' : isUpcoming ? 'Register' : 'Review Problems'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
