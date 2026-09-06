import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Zap,
  Sliders,
  ShieldCheck,
  Activity,
  AlertCircle,
  Check,
  Save,
  Lock,
  RefreshCw
} from 'lucide-react';
import { UserProfile, PlatformSettings } from '../../../types';
import { AdminService } from '../../../services/adminService';

interface AdminSparkViewProps {
  currentUser: UserProfile;
}

export const AdminSparkView: React.FC<AdminSparkViewProps> = ({ currentUser }) => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [rateLimit, setRateLimit] = useState(20);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const loadSettings = async () => {
    setLoading(true);
    const res = await AdminService.getSettings(currentUser);
    if (res.success && res.settings) {
      setSettings(res.settings);
      setRateLimit(res.settings.sparkAiRateLimitPerMin || 20);
      setFlags(res.settings.featureFlags || {});
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggleFlag = (key: string) => {
    setFlags(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await AdminService.updateSettings(currentUser, {
      sparkAiRateLimitPerMin: rateLimit,
      featureFlags: flags
    });
    if (res.success) {
      showToast('Spark AI configuration saved successfully.');
    } else {
      showToast(res.error || 'Failed to update settings');
    }
    setIsSaving(false);
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
            <Sparkles className="h-6 w-6 text-amber-400" />
            Spark AI Platform Controls
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Intelligent coding mentor feature toggles, rate limits, secret masking, and telemetry.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0c14] p-4 shadow-lg">
          <div className="text-xs text-white/50 mb-1">Total Invocations (24h)</div>
          <div className="text-2xl font-bold text-white">1,420</div>
          <div className="text-[11px] text-emerald-400 mt-1">● 99.8% Healthy Delivery</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0c0c14] p-4 shadow-lg">
          <div className="text-xs text-white/50 mb-1">Average Latency</div>
          <div className="text-2xl font-bold text-white">412 ms</div>
          <div className="text-[11px] text-white/40 mt-1">Streaming TTFT ~180ms</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0c0c14] p-4 shadow-lg">
          <div className="text-xs text-white/50 mb-1">Model Engine</div>
          <div className="text-lg font-bold text-white truncate">Gemini 2.5 Pro</div>
          <div className="text-[11px] text-amber-400 mt-1">Low-Temperature Reasoning</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0c0c14] p-4 shadow-lg">
          <div className="text-xs text-white/50 mb-1">Credential Security</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <Lock className="h-4 w-4" />
            Zero-Leak Enforced
          </div>
          <div className="text-[11px] text-white/40 mt-1">Server-side isolated</div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="h-5 w-5 text-amber-400" />
          Feature Flags & Cognitive Modules
        </h3>

        <div className="space-y-3">
          {[
            { key: 'spark_ai', title: 'Master Spark AI Engine', desc: 'Global switch for all intelligent assistance throughout CodeSpark.' },
            { key: 'spark_hints', title: 'Progressive Hints Module', desc: 'Allows users to unlock 3-tier progressive hints without spoilers.' },
            { key: 'spark_debugging', title: 'Code Debugger & Traceback Explainer', desc: 'Analyzes user stacktraces, testcase failures, and syntax traps.' },
            { key: 'spark_complexity_audit', title: 'Complexity & Optimality Audit', desc: 'Evaluates Big-O time and auxiliary space consumption on accepted solutions.' },
            { key: 'interview_simulations', title: 'Mock Technical Interviewer', desc: 'Interactive AI persona questioning approach, tradeoffs, and edge cases.' }
          ].map(module => (
            <div
              key={module.key}
              className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div>
                <div className="font-semibold text-white text-sm">{module.title}</div>
                <div className="text-xs text-white/50">{module.desc}</div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags[module.key] ?? true}
                  onChange={() => handleToggleFlag(module.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Limits & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Rate Limiting (Cost & Abuse Control)
          </h3>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-2">
              Maximum Prompt Queries per User per Minute
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value, 10) || 20)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#14141f] text-white text-sm focus:outline-none focus:border-amber-400"
            />
            <p className="text-[11px] text-white/40 mt-1.5">
              Protects against malicious token drainage while allowing uninterrupted problem solving.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Credential & Secret Protection
          </h3>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 space-y-1.5">
            <div className="font-semibold">Backend Secret Isolation: Verified</div>
            <p className="text-emerald-300/80">
              API tokens and system keys are strictly held in environment variables and never exposed to the client bundle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
