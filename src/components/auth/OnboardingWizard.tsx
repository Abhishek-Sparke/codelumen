import React, { useState } from 'react';
import { 
  Check, ArrowRight, ArrowLeft, Code, Target, Compass, Sparkles, 
  BookOpen, Zap, Layers, Activity, Award, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { SupportedLanguage, ExperienceLevel, UserGoal, UserProfile, LearningStyle } from '../../types';
import { StorageService } from '../../services/storage';

interface OnboardingWizardProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onComplete: (updated: Partial<UserProfile>) => void;
  onOpenAssessment?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  currentUser,
  onComplete,
  onOpenAssessment
}) => {
  // Section 18: Resume from last saved onboarding step if interrupted
  const savedProgress = StorageService.getOnboardingProgress(currentUser.id);
  const initialStep = (savedProgress?.current_step && savedProgress.current_step >= 1 && savedProgress.current_step <= 6)
    ? (savedProgress.current_step as 1 | 2 | 3 | 4 | 5 | 6)
    : 1;

  const [step, setStepState] = useState<1 | 2 | 3 | 4 | 5 | 6>(initialStep);
  const [name, setName] = useState(currentUser.name || 'Developer');
  const [experience, setExperience] = useState<ExperienceLevel>(
    savedProgress?.experience_level || currentUser.experienceLevel || 'Beginner'
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    savedProgress?.goals && savedProgress.goals.length > 0 
      ? savedProgress.goals 
      : (currentUser.goals && currentUser.goals.length > 0 ? currentUser.goals : ['DSA Fundamentals', 'Coding Interviews'])
  );
  const [language, setLanguage] = useState<SupportedLanguage>(
    savedProgress?.preferred_language || currentUser.preferredLanguage || 'python'
  );
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(
    savedProgress?.learning_style || currentUser.learningStyle || 'mixed'
  );

  const setStep = (nextStep: 1 | 2 | 3 | 4 | 5 | 6) => {
    setStepState(nextStep);
    // Section 18: Persist onboarding progress immediately
    StorageService.saveOnboardingProgress(currentUser.id, {
      current_step: nextStep,
      experience_level: experience,
      goals: selectedGoals,
      preferred_language: language,
      learning_style: learningStyle
    });
  };

  if (!isOpen) return null;

  const toggleGoal = (goalLabel: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalLabel) 
        ? (prev.length > 1 ? prev.filter(g => g !== goalLabel) : prev) 
        : [...prev, goalLabel]
    );
  };

  const getStartingRoadmap = () => {
    switch (experience) {
      case 'Beginner':
        return {
          title: 'Programming Foundations & Arrays',
          startingTopic: 'Arrays & Hashing',
          topics: [
            'Programming Foundations',
            'Arrays & Hashing',
            'Hash Maps',
            'Two Pointers',
            'Sliding Window',
            'Stack & Queue',
            'Binary Search',
            'Linked Lists',
            'Trees & BST',
            'Graphs & BFS/DFS',
            'Dynamic Programming'
          ]
        };
      case 'Intermediate':
        return {
          title: 'Algorithmic Patterns & Data Structures',
          startingTopic: 'Arrays & Hashing',
          topics: [
            'Arrays & Hashing',
            'Two Pointers',
            'Sliding Window',
            'Binary Search',
            'Trees & BST',
            'Graphs',
            'Dynamic Programming'
          ]
        };
      case 'Advanced':
        return {
          title: 'Advanced Algorithmic Mastery',
          startingTopic: 'Advanced Patterns',
          topics: [
            'Advanced Patterns',
            'Graphs & Network Flow',
            'Advanced Dynamic Programming',
            'Greedy Strategy',
            'Advanced Data Structures',
            'Hard Interview Problems',
            'Competitive Programming'
          ]
        };
    }
  };

  const roadmapInfo = getStartingRoadmap();

  const handleFinish = (openAssessment = false) => {
    const finalData = {
      name: name.trim() || 'Developer',
      experienceLevel: experience,
      goals: selectedGoals,
      goal: (selectedGoals[0] as UserGoal) || 'Learn DSA',
      preferredLanguage: language,
      learningStyle,
      recommendedStartingTopic: roadmapInfo.startingTopic,
      journeyState: 'starting_journey' as const,
      onboarding_completed: true
    };

    const completedUser = StorageService.completeOnboarding(currentUser.id, finalData);
    onComplete(completedUser || finalData);

    if (openAssessment && onOpenAssessment) {
      onOpenAssessment();
    }
  };

  const languages: { id: SupportedLanguage; label: string; icon: string; ext: string }[] = [
    { id: 'python', label: 'Python', icon: '🐍', ext: '.py' },
    { id: 'cpp', label: 'C++', icon: '⚡', ext: '.cpp' },
    { id: 'java', label: 'Java', icon: '☕', ext: '.java' },
    { id: 'javascript', label: 'JavaScript', icon: '🌐', ext: '.js' },
    { id: 'go', label: 'Go', icon: '🐹', ext: '.go' },
    { id: 'rust', label: 'Rust', icon: '🦀', ext: '.rs' },
  ];

  const experienceOptions: { id: ExperienceLevel; title: string; subtitle: string; desc: string }[] = [
    { 
      id: 'Beginner', 
      title: 'BEGINNER', 
      subtitle: 'Starting from fundamentals',
      desc: 'I’m new to DSA and coding interviews. I want step-by-step guidance, visual explanations, and core algorithmic concepts.' 
    },
    { 
      id: 'Intermediate', 
      title: 'INTERMEDIATE', 
      subtitle: 'Ready to master patterns',
      desc: 'I know the fundamentals and want to improve. Ready to tackle standard interview mediums, patterns, and space/time tradeoffs.' 
    },
    { 
      id: 'Advanced', 
      title: 'ADVANCED', 
      subtitle: 'Sharpening high-performance problem solving',
      desc: 'I regularly solve coding problems and want to sharpen my skills. Focus on hard interview problems, DP, graphs, and competitive speed.' 
    },
  ];

  const goalOptions = [
    { id: 'DSA Fundamentals', label: 'DSA Fundamentals', desc: 'Master foundational data structures and core algorithmic logic' },
    { id: 'Coding Interviews', label: 'Coding Interviews', desc: 'Ace top-tier technical loops, system DSA, and FAANG style interviews' },
    { id: 'Competitive Programming', label: 'Competitive Programming', desc: 'Train speed, math proofs, and rigorous contest time limits' },
    { id: 'Improve Problem Solving', label: 'Improve Problem Solving', desc: 'Develop intuition for breaking down complex unseen problems' },
    { id: 'Become Faster at Coding', label: 'Become Faster at Coding', desc: 'Optimize code implementation velocity, debugging, and edge-case detection' },
  ];

  const learningStyles: { id: LearningStyle; title: string; desc: string; icon: any }[] = [
    { 
      id: 'concepts_first', 
      title: 'Learn concepts first', 
      desc: 'Structured theoretical breakdown, visual animations, and worked examples before writing any code.',
      icon: BookOpen
    },
    { 
      id: 'practice_immediately', 
      title: 'Practice immediately', 
      desc: 'Dive straight into code problems. Learn through compiler feedback, test cases, and diagnostic hints.',
      icon: Zap
    },
    { 
      id: 'mixed', 
      title: 'Mix learning and practice', 
      desc: 'A balanced rhythm: short conceptual intuition followed immediately by hands-on challenge problems.',
      icon: Layers
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] p-6 sm:p-8 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step Progress Bar (steps 2 to 6) */}
        {step > 1 && (
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-black">
                {step - 1}
              </span>
              <span className="text-xs font-semibold text-white/80">Step {step - 1} of 5</span>
            </div>
            <div className="flex gap-1.5">
              {[2, 3, 4, 5, 6].map(s => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? 'w-7 bg-amber-400' : s < step ? 'w-3 bg-amber-400/50' : 'w-3 bg-white/10'
                  }`} 
                />
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: WELCOME SCREEN (Section 3) */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200 text-center py-4">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent border border-amber-400/30 shadow-lg shadow-amber-500/10">
              <Sparkles className="h-7 w-7 text-amber-400" />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-2">
              YOUR PERSONALIZED CODING PATH
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Welcome to CodeSpark.
            </h2>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white/90 mb-4">
              Let&apos;s build your coding journey.
            </h3>

            <p className="text-sm leading-relaxed text-white/60 max-w-md mx-auto mb-8">
              Tell us a little about yourself and we&apos;ll create a path that fits your goals. Every developer begins with fresh earned progress.
            </p>

            <div className="mb-8 max-w-xs mx-auto text-left">
              <label className="block text-xs font-medium text-white/70 mb-1.5">Preferred Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-transform"
            >
              <span>Let&apos;s Begin →</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: EXPERIENCE LEVEL (Section 4) */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              Where are you right now?
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Your experience level determines WHERE you start, not whether you start with existing progress.
            </p>

            {/* Crucial Zero Progress notice */}
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-300">
              <span className="font-semibold">Note:</span>
              <span>All levels begin with 0 Solves, 0 XP, and 0 Streak.</span>
            </div>

            <div className="mt-5 space-y-3">
              {experienceOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setExperience(opt.id)}
                  className={`flex w-full items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                    experience === opt.id
                      ? 'border-amber-400/80 bg-amber-500/10 text-white shadow-sm ring-1 ring-amber-400/30'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{opt.title}</span>
                      <span className="text-xs text-white/40">· {opt.subtitle}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/70">{opt.desc}</p>
                  </div>
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    experience === opt.id ? 'border-amber-400 bg-amber-400 text-black' : 'border-white/20'
                  }`}>
                    {experience === opt.id && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
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
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-transform"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: GOAL (Multi-select) (Section 5) */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                What do you want to achieve?
              </h3>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Select all goals that apply. We customize your problem curation based on your choices.
            </p>

            <div className="mt-5 space-y-2.5">
              {goalOptions.map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-amber-400/80 bg-amber-500/10 text-white ring-1 ring-amber-400/30'
                        : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-white">{g.label}</span>
                      <p className="text-[11px] text-white/50">{g.desc}</p>
                    </div>
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
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
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-transform"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PROGRAMMING LANGUAGE (Section 6) */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              What language do you want to practice?
            </h3>
            <p className="mt-1 text-xs text-white/50">
              This sets your default code editor template. You can switch languages at any time.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {languages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-xs transition-all ${
                    language === item.id
                      ? 'border-amber-400/80 bg-amber-500/10 text-white shadow-sm ring-1 ring-amber-400/30'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <span className="font-semibold block">{item.label}</span>
                      <span className="text-[10px] text-white/40 font-mono">{item.ext}</span>
                    </div>
                  </div>
                  {language === item.id && (
                    <Check className="h-4 w-4 text-amber-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-transform"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: LEARNING PREFERENCE (Section 7) */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              How do you like to learn?
            </h3>
            <p className="mt-1 text-xs text-white/50">
              We adjust the pacing of lessons, theory cards, and interactive exercises based on your style.
            </p>

            <div className="mt-5 space-y-3">
              {learningStyles.map((item) => {
                const Icon = item.icon;
                const isSelected = learningStyle === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLearningStyle(item.id)}
                    className={`flex w-full items-start justify-between rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-amber-400/80 bg-amber-500/10 text-white ring-1 ring-amber-400/30'
                        : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-amber-400 text-black' : 'bg-white/5 text-white/50'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{item.title}</span>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/50">{item.desc}</p>
                      </div>
                    </div>
                    <div className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={() => setStep(6)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-transform"
              >
                <span>Calculate My Path</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: PERSONALIZED STARTING POINT (Section 8) */}
        {/* ========================================================================= */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-400">
              <Compass className="h-3.5 w-3.5" />
              <span>YOUR RECOMMENDED PATH</span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-white mt-1">
              Personalized Starting Point
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Calculated for <span className="text-white font-medium">{experience}</span> level in <span className="text-amber-400 font-medium capitalize">{language}</span>.
            </p>

            {/* Zero Progress Guarantee Indicator */}
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/60 font-medium">Roadmap Progress</span>
                <span className="font-mono font-bold text-amber-400">0% (0 / {roadmapInfo.topics.length} Mastered)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-amber-400 w-0 transition-all duration-500" />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-white/40">
                <span>0 Solves</span>
                <span>0 XP</span>
                <span>0 Streak</span>
                <span>Unrated</span>
              </div>
            </div>

            {/* Curriculum Track List */}
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 max-h-48 overflow-y-auto space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block mb-1">
                Curriculum Sequence
              </span>
              {roadmapInfo.topics.map((topic, idx) => (
                <div 
                  key={topic} 
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg ${
                    idx === 0 ? 'bg-amber-500/10 border border-amber-500/20 text-white font-semibold' : 'text-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono ${idx === 0 ? 'text-amber-400' : 'text-white/30'}`}>
                      {idx + 1}.
                    </span>
                    <span>{topic}</span>
                  </div>
                  {idx === 0 ? (
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-amber-400 text-black font-bold">
                      Start Here
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/30">Upcoming</span>
                  )}
                </div>
              ))}
            </div>

            {/* Optional Skill Assessment option for Intermediate / Advanced (Section 24) */}
            {(experience === 'Intermediate' || experience === 'Advanced') && (
              <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-200 block">Optional Skill Assessment</span>
                  <span className="text-[11px] text-indigo-300/70">Test your DSA strengths to fine-tune your recommended starting topic.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleFinish(true)}
                  className="rounded-lg border border-indigo-400/40 bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/30 shrink-0 ml-3 transition-colors"
                >
                  Take Diagnostic
                </button>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(5)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={() => handleFinish(false)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-bold text-black shadow-lg shadow-amber-500/25 hover:scale-[1.01] transition-transform"
              >
                <span>Start Learning →</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
