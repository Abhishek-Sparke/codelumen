import React from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Code,
  Sparkles,
  Award
} from 'lucide-react';
import { UserProfile } from '../../../types';

interface AdminAnalyticsViewProps {
  currentUser: UserProfile;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ currentUser }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <TrendingUp className="h-6 w-6 text-amber-400" />
          Platform Analytics & Telemetry
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Submission trends, user solving distributions, algorithmic engagement, and AI mentor utilization.
        </p>
      </div>

      {/* Grid of Telemetry Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solves by Difficulty */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-emerald-400" />
            Solved Distribution by Difficulty
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="font-semibold text-emerald-400">Easy Problems</span>
                <span className="font-mono">482 Solves (54%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '54%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="font-semibold text-amber-400">Medium Problems</span>
                <span className="font-mono">312 Solves (35%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="font-semibold text-red-400">Hard Problems</span>
                <span className="font-mono">96 Solves (11%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '11%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Spark AI Query Breakdown */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Spark AI Interaction Categories
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="text-white font-medium">Progressive Hints</span>
                <span className="font-mono text-amber-400">58%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="text-white font-medium">Debugger & Testcase Diagnoses</span>
                <span className="font-mono text-amber-400">24%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="text-white font-medium">Complexity Analysis</span>
                <span className="font-mono text-amber-400">18%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
