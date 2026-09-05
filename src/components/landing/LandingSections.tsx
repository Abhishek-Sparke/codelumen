import React from 'react';
import { 
  Map, Code, Bot, Flame, Trophy, Users, ArrowRight, 
  Layers, CheckCircle, Sparkles, TrendingUp
} from 'lucide-react';
import { PATTERNS_DATA } from '../../data/patterns';
import { SAMPLE_USERS } from '../../data/users';

interface LandingSectionsProps {
  onStartCoding: () => void;
  onExploreRoadmap: () => void;
  onSelectPattern: (patternId: string) => void;
}

export const LandingSections: React.FC<LandingSectionsProps> = ({
  onStartCoding,
  onExploreRoadmap,
  onSelectPattern
}) => {
  const corePillars = [
    {
      icon: Map,
      title: 'Structured Roadmaps',
      description: 'Pattern-based learning paths that tell users what to learn next with prerequisites and difficulty pacing.',
      tag: 'Step-by-step',
      gradient: 'from-amber-500/20 to-transparent'
    },
    {
      icon: Code,
      title: 'Practice Problems',
      description: 'Curated original problems across all major DSA patterns with full test harnesses and edge cases.',
      tag: '50+ Curated',
      gradient: 'from-cyan-500/20 to-transparent'
    },
    {
      icon: Bot,
      title: 'Socratic AI Coach',
      description: 'Progressive hints and conceptual direction that help you solve problems yourself without leaking solutions.',
      tag: 'Pedagogical',
      gradient: 'from-emerald-500/20 to-transparent'
    },
    {
      icon: Trophy,
      title: 'Interview Mode',
      description: 'Timed practice, mock interview simulations, and weekly contests with global performance analytics.',
      tag: 'Real Conditions',
      gradient: 'from-purple-500/20 to-transparent'
    }
  ];

  return (
    <div className="space-y-28 sm:space-y-36 pb-24">
      
      {/* SECTION 1: Everything you need */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="lumen-tag text-amber-400">Core Architecture</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Everything you need to become interview ready
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-white/60 leading-relaxed">
            Eliminate tutorial hell. CodeLumen replaces passive video consumption with deliberate, feedback-driven practice.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="glass-panel glass-panel-hover flex flex-col justify-between rounded-3xl p-6 sm:p-7 border border-white/[0.08]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/10 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center text-[11px] font-semibold text-amber-400">
                  <span>Explore module</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Learn patterns, not the answers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#121218] to-[#0a0a0d] p-8 sm:p-14 relative overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl -z-10" />
          
          <div className="max-w-2xl">
            <span className="lumen-tag text-cyan-400">Mastery Philosophy</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Learn the patterns, not the answers.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-white/60 leading-relaxed">
              Top tech companies never ask the exact problems you memorized. By mastering the 10+ core patterns, you build an intuition that solves any novel problem on the spot.
            </p>
          </div>

          {/* Pattern chips grid */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {PATTERNS_DATA.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPattern(p.id)}
                className="group flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-left transition-all hover:border-amber-400/40 hover:bg-white/[0.05]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {p.title}
                    </span>
                    <Layers className="h-3.5 w-3.5 text-white/30 group-hover:text-amber-400" />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/50">
                    {p.tagline}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>{p.timeComplexity.split(' ')[0]}</span>
                  <span className="text-amber-400 font-sans font-semibold group-hover:translate-x-0.5 transition-transform">
                    View &rarr;
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Your progress, visualized */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="lumen-tag text-emerald-400">Actionable Telemetry</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Your progress, visualized.
            </h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Every solved problem updates your competency radar. See where your algorithmic strengths lie and identify blind spots before your technical loops.
            </p>
            <div className="pt-3 space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Difficulty distribution tracking (Easy, Medium, Hard)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Topic and pattern mastery percentages</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>GitHub-style 365-day practice heatmap</span>
              </div>
            </div>
          </div>

          {/* Progress dashboard preview card */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl border border-white/[0.12] bg-[#0c0c11] p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Stat counters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <span className="text-[11px] text-white/40">Solved</span>
                  <p className="font-display text-2xl font-bold text-white mt-1">142</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">+8 this week</span>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <span className="text-[11px] text-white/40">Active Streak</span>
                  <p className="font-display text-2xl font-bold text-amber-400 mt-1 flex items-center gap-1">
                    <Flame className="h-5 w-5 fill-amber-400" />
                    18 Days
                  </p>
                  <span className="text-[10px] text-white/40">Longest: 24 days</span>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <span className="text-[11px] text-white/40">Global Rank</span>
                  <p className="font-display text-2xl font-bold text-white mt-1">#342</p>
                  <span className="text-[10px] text-amber-400/80 font-semibold">Top 2.5%</span>
                </div>
              </div>

              {/* Difficulty breakdown bars */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-white/70">Difficulty Breakdown</span>
                
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span className="text-emerald-400 font-medium">Easy (68 / 80)</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[85%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span className="text-amber-400 font-medium">Medium (58 / 100)</span>
                    <span>58%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[58%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span className="text-rose-400 font-medium">Hard (16 / 40)</span>
                    <span>40%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full w-[40%]" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: Built for consistency & Social */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Consistency Card */}
          <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="h-4 w-4 fill-amber-400" />
                Built for consistency
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold text-white">
                Daily algorithmic challenges with streak protection
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-white/60">
                Consistency trumps cramming. Tackle our featured problem of the day, earn +100 XP, and keep your flame alive.
              </p>

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Today&apos;s Challenge
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Longest Consecutive Sequence
                  </p>
                  <span className="text-[11px] text-white/40">Medium · Hash Map · +100 XP</span>
                </div>
                <button
                  onClick={onStartCoding}
                  className="rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-black hover:bg-amber-300 transition-colors"
                >
                  Solve Now
                </button>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-white/40 flex items-center justify-between">
              <span>Next challenge in 6h 24m</span>
              <span className="text-emerald-400 font-semibold">+100 XP Reward</span>
            </div>
          </div>

          {/* Social Community Card */}
          <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Users className="h-4 w-4" />
                Practice with others
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold text-white">
                Follow developers, discuss solutions, and compare runtimes
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-white/60">
                Join our peer-driven community. Review optimal solutions, share your algorithmic write-ups, and compete on the global leaderboard.
              </p>

              {/* Sample User Avatars */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {SAMPLE_USERS.slice(0, 5).map(u => (
                    <img
                      key={u.id}
                      src={u.avatar}
                      alt={u.name}
                      className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0c0c11] object-cover"
                    />
                  ))}
                </div>
                <div className="text-xs text-white/60">
                  <strong className="text-white">10,000+</strong> active practicing engineers
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-white/40 flex items-center justify-between">
              <span>Global, Weekly &amp; Friends Leaderboards</span>
              <span className="text-purple-400 font-semibold">Active Community</span>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-b from-[#14141d] to-[#09090c] p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-96 rounded-full bg-amber-500/10 blur-3xl -z-10" />
          
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Start your coding journey.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-xs sm:text-sm text-white/60 leading-relaxed">
            Take the guesswork out of technical interview preparation. Learn the patterns, write the code, and master DSA today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartCoding}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-9 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-xl shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              Start Coding Now
            </button>
            <button
              onClick={onExploreRoadmap}
              className="w-full sm:w-auto rounded-full border border-white/15 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
            >
              Explore DSA Roadmap
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
