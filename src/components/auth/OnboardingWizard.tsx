import React, { useState } from 'react';
import { Check, ArrowRight, Code, Target, Compass, Sparkles } from 'lucide-react';
import { SupportedLanguage, ExperienceLevel, UserGoal, UserProfile } from '../../types';

interface OnboardingWizardProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onComplete: (updated: Partial<UserProfile>) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  currentUser,
  onComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState(currentUser.name || 'Ada Okonkwo');
  const [username, setUsername] = useState(currentUser.username || 'ada_codes');
  const [language, setLanguage] = useState<SupportedLanguage>(currentUser.preferredLanguage || 'python');
  const [experience, setExperience] = useState<ExperienceLevel>(currentUser.experienceLevel || 'Intermediate');
  const [goal, setGoal] = useState<UserGoal>(currentUser.goal || 'Prepare for interviews');

  if (!isOpen) return null;

  const handleFinish = () => {
    onComplete({
      name,
      username,
      preferredLanguage: language,
      experienceLevel: experience,
      goal
    });
  };

  const languages: { id: SupportedLanguage; label: string; icon: string }[] = [
    { id: 'python', label: 'Python 3', icon: '🐍' },
    { id: 'javascript', label: 'JavaScript', icon: '⚡' },
    { id: 'cpp', label: 'C++ 20', icon: '⚡' },
    { id: 'java', label: 'Java 21', icon: '☕' },
    { id: 'go', label: 'Go', icon: '🐹' },
    { id: 'rust', label: 'Rust', icon: '🦀' },
  ];

  const experienceLevels: { id: ExperienceLevel; title: string; desc: string }[] = [
    { id: 'Beginner', title: 'Beginner', desc: 'New to algorithms and data structures. Looking to understand the fundamentals step-by-step.' },
    { id: 'Intermediate', title: 'Intermediate', desc: 'Familiar with arrays, trees, and recursion. Looking to master patterns and solve Mediums.' },
    { id: 'Advanced', title: 'Advanced', desc: 'Experienced solver. Prepping for L5/L6 senior loops, competitive programming, and Hards.' },
  ];

  const goals: { id: UserGoal; label: string; icon: any }[] = [
    { id: 'Prepare for interviews', label: 'Prepare for FAANG & Tech Interviews', icon: Target },
    { id: 'Learn DSA', label: 'Learn Core Data Structures & Algorithms', icon: Compass },
    { id: 'Improve problem solving', label: 'Build Daily Problem-Solving Discipline', icon: Sparkles },
    { id: 'Competitive programming', label: 'Train for Competitive Programming', icon: Code },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] p-6 sm:p-8 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-black">
              {step}
            </span>
            <span className="text-xs font-semibold text-white/80">Step {step} of 4</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-amber-400' : s < step ? 'w-3 bg-amber-400/50' : 'w-3 bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Step 1: Name & Username */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              Welcome to CodeLumen
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Let&apos;s personalize your developer identity and profile card.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-xs text-white focus:border-amber-400/50 focus:outline-none"
                  placeholder="e.g. Ada Lovelace"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Username Handle</label>
                <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
                  <span className="flex items-center pl-4 text-xs text-white/40">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full bg-transparent px-2 py-3 text-xs text-white focus:outline-none"
                    placeholder="adalovelace"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Step 2: Preferred Language */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              Choose your primary language
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Starter code and test templates will default to this language across all problems.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {languages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-xs transition-all ${
                    language === item.id
                      ? 'border-amber-400/60 bg-amber-500/10 text-white shadow-sm'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  {language === item.id && (
                    <Check className="h-4 w-4 text-amber-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Experience Level */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              What is your experience level?
            </h3>
            <p className="mt-1 text-xs text-white/50">
              We tailor your problem recommendations and AI hint depth based on your comfort level.
            </p>

            <div className="mt-6 space-y-3">
              {experienceLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setExperience(lvl.id)}
                  className={`flex w-full items-start justify-between rounded-xl border p-4 text-left transition-all ${
                    experience === lvl.id
                      ? 'border-amber-400/60 bg-amber-500/10 text-white'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-white">{lvl.title}</span>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/50">{lvl.desc}</p>
                  </div>
                  {experience === lvl.id && (
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Primary Goal */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              What is your primary goal?
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Choose your focus to generate your customized roadmap curriculum.
            </p>

            <div className="mt-6 space-y-2.5">
              {goals.map((g) => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-xs transition-all ${
                      goal === g.id
                        ? 'border-amber-400/60 bg-amber-500/10 text-white'
                        : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        goal === g.id ? 'bg-amber-400/20 text-amber-300' : 'bg-white/5 text-white/50'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold">{g.label}</span>
                    </div>
                    {goal === g.id && (
                      <Check className="h-4 w-4 text-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/25"
              >
                <span>Complete Setup</span>
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
