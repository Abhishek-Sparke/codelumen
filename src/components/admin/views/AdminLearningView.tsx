import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Plus,
  Clock,
  Code,
  Layers,
  Check,
  Edit2
} from 'lucide-react';
import { UserProfile, RoadmapStage } from '../../../types';
import { ROADMAP_STAGES } from '../../../data/roadmaps';
import { STUDY_PLANS_DATA } from '../../../data/studyPlans';

interface AdminLearningViewProps {
  currentUser: UserProfile;
}

export const AdminLearningView: React.FC<AdminLearningViewProps> = ({ currentUser }) => {
  const [stages, setStages] = useState<RoadmapStage[]>([...ROADMAP_STAGES]);
  const [activeTab, setActiveTab] = useState<'roadmaps' | 'plans'>('roadmaps');
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
            <Compass className="h-6 w-6 text-amber-400" />
            Curriculum, Roadmaps & Study Plans
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Organize learning paths, stage dependencies, and structured interview preparation tracks.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'roadmaps'
                ? 'bg-amber-400/20 text-amber-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            DSA Roadmap ({stages.length} Stages)
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'plans'
                ? 'bg-amber-400/20 text-amber-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Study Plans ({STUDY_PLANS_DATA.length})
          </button>
        </div>
      </div>

      {/* Roadmaps Tab */}
      {activeTab === 'roadmaps' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-lg flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400 text-xs font-bold font-mono">
                      #{stage.order}
                    </span>
                    <h3 className="font-bold text-white text-sm">{stage.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/5 text-white/60 border border-white/10">
                    {stage.difficultyRange}
                  </span>
                </div>

                <p className="text-xs text-white/60 mb-4 line-clamp-2">
                  {stage.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                <span className="flex items-center gap-1 font-mono">
                  <Code className="h-3.5 w-3.5" />
                  {stage.problemIds.length} Problems
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Est. {stage.estimatedHours} Hours
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Study Plans Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDY_PLANS_DATA.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-lg flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-sm">{plan.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {plan.difficulty}
                  </span>
                </div>

                <p className="text-xs text-white/60 mb-4">
                  {plan.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                <span>{plan.totalProblems} Total Exercises</span>
                <span>{plan.estimatedDuration} Duration</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
