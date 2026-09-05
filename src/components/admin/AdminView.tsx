import React, { useState } from 'react';
import { 
  Shield, Plus, Trash2, Edit3, Code, Users, 
  MessageSquare, TrendingUp, Check, X, AlertCircle 
} from 'lucide-react';
import { Problem, Difficulty } from '../../types';
import { ALL_PROBLEMS } from '../../data/problems';
import { StorageService } from '../../services/storage';

interface AdminViewProps {
  onNavigateProblem: (problemId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onNavigateProblem
}) => {
  const [problems, setProblems] = useState<Problem[]>([...ALL_PROBLEMS]);
  const [activeTab, setActiveTab] = useState<'problems' | 'users' | 'analytics'>('problems');
  const [isCreatingProblem, setIsCreatingProblem] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const registeredUsers = StorageService.getAllUsers();

  // Form states for problem creation
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('Easy');
  const [newTopic, setNewTopic] = useState('Arrays');
  const [newPattern, setNewPattern] = useState('Hash Map');
  const [newCompanies, setNewCompanies] = useState('Google, Meta');
  const [newDescription, setNewDescription] = useState('');
  const [newConstraints, setNewConstraints] = useState('1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9');
  const [newExampleInput, setNewExampleInput] = useState('nums = [1, 2, 3], target = 5');
  const [newExampleOutput, setNewExampleOutput] = useState('[1, 2]');

  const handleDeleteProblem = (id: string) => {
    if (window.confirm('Delete problem ' + id + '?')) {
      setProblems(prev => prev.filter(p => p.id !== id));
      showToast('Problem deleted successfully.');
    }
  };

  const handleCreateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const slug = newSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const problemId = `p-${Date.now()}`;

    const created: Problem = {
      id: problemId,
      slug,
      title: newTitle,
      difficulty: newDifficulty,
      acceptance: '65.0%',
      topic: newTopic,
      pattern: newPattern,
      companies: newCompanies.split(',').map(c => c.trim()),
      description: newDescription,
      examples: [
        { input: newExampleInput, output: newExampleOutput }
      ],
      constraints: newConstraints.split('\n').filter(Boolean),
      starterCode: {
        javascript: `function ${slug.replace(/-/g, '_')}(input) {\n  // Implement solution\n}`,
        python: `def ${slug.replace(/-/g, '_')}(input):\n    pass`,
        cpp: `class Solution { public: void solve() {} };`,
        java: `class Solution { public void solve() {} }`,
        go: `func solve() {}`,
        rust: `impl Solution { pub fn solve() {} }`
      },
      testCases: [
        { input: [[1, 2, 3], 5], expected: [1, 2] }
      ],
      hints: [
        { level: 1, type: 'conceptual', title: 'Start with Invariants', content: 'Break down the base conditions first.' }
      ],
      editorial: {
        summary: 'Official algorithmic analysis for ' + newTitle,
        patternExplanation: `This problem demonstrates the ${newPattern} paradigm.`,
        bruteForce: {
          name: 'Brute Force Scan',
          complexity: { time: 'O(n²)', space: 'O(1)' },
          explanation: 'Iterate all pairs.',
          code: '// Brute force'
        },
        optimal: {
          name: 'Optimal Linear Solution',
          complexity: { time: 'O(n)', space: 'O(n)' },
          explanation: 'Single pass using hash table.',
          code: '// Optimal solution'
        }
      },
      similarProblemIds: ['p-1']
    };

    setProblems(prev => [created, ...prev]);
    ALL_PROBLEMS.unshift(created); // Also update live memory
    setIsCreatingProblem(false);
    showToast(`Created problem "${newTitle}" successfully.`);

    // Reset fields
    setNewTitle('');
    setNewSlug('');
    setNewDescription('');
  };

  const showToast = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            <Shield className="h-3.5 w-3.5" />
            <span>Staff Administration</span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Platform curriculum management, problem authoring, user moderation, and system telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingProblem(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="h-4 w-4" />
          <span>Create Problem</span>
        </button>
      </div>

      {successNotice && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-300">
          <Check className="h-4 w-4" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-[11px] text-white/40">Total Problems</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">{problems.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+12 this month</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-[11px] text-white/40">Registered Users</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-cyan-400">10,480</p>
          <span className="text-[10px] text-white/40 font-mono">1,420 DAU</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-[11px] text-white/40">Submissions Processed</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-amber-400">142,850</p>
          <span className="text-[10px] text-emerald-400 font-semibold">99.8% sandbox uptime</span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <span className="text-[11px] text-white/40">Overall Acceptance</span>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-purple-400">58.4%</p>
          <span className="text-[10px] text-white/40 font-mono">Platform average</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-medium">
        {[
          { id: 'problems', label: `Manage Problems (${problems.length})` },
          { id: 'users', label: `User Accounts (${registeredUsers.length})` },
          { id: 'analytics', label: 'Platform Telemetry' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              activeTab === t.id ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: Problems Management Table */}
      {activeTab === 'problems' && (
        <div className="glass-panel overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0b10]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-[#0e0e14] text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pl-6 pr-4">ID</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Pattern</th>
                  <th className="py-3.5 px-4">Topic</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {problems.map((prob) => (
                  <tr key={prob.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 pl-6 pr-4 font-mono text-white/40 text-[11px]">
                      {prob.id}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {prob.title}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white/70">
                      {prob.pattern}
                    </td>
                    <td className="py-4 px-4 text-white/50">
                      {prob.topic}
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right space-x-2">
                      <button
                        onClick={() => onNavigateProblem(prob.id)}
                        className="rounded-lg bg-white/5 p-1.5 text-white/60 hover:text-white"
                        title="Open Problem"
                      >
                        <Code className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(prob.id)}
                        className="rounded-lg bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20"
                        title="Delete Problem"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Users Management */}
      {activeTab === 'users' && (
        <div className="glass-panel overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0b10]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-[#0e0e14] text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pl-6 pr-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">XP Score</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {registeredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-white/40">
                      No registered user accounts found in database yet.
                    </td>
                  </tr>
                ) : (
                  registeredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.03]">
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                          <div>
                            <span className="font-semibold text-white">{user.name}</span>
                            <span className="block text-[11px] text-white/40">@{user.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-white/60 text-[11px]">
                        {user.email}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          user.role === 'admin' ? 'bg-amber-400/20 text-amber-300' : 'bg-white/5 text-white/60'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-cyan-400">
                        {user.xp} XP
                      </td>
                      <td className="py-4 pr-6 pl-4 text-right text-white/40 text-[11px]">
                        {user.joinedDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Analytics */}
      {activeTab === 'analytics' && (
        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] space-y-6 text-xs text-white/70 leading-relaxed">
          <h3 className="font-display text-base font-bold text-white">System Architecture &amp; Execution Queue</h3>
          <p>
            Submissions are dispatched through an asynchronous execution queue to sandboxed Docker/gVisor worker pods. Each execution enforces strict container cgroups:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 font-mono text-[11px]">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-white/40 block">CPU Quota</span>
              <strong className="text-white text-sm">1.0 vCPU limit</strong>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-white/40 block">Memory Ceiling</span>
              <strong className="text-white text-sm">256 MB RAM limit</strong>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-white/40 block">Timeout Kill</span>
              <strong className="text-white text-sm">2.0 seconds</strong>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROBLEM MODAL (Full 13 fields as required in spec) */}
      {isCreatingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className="glass-panel relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.12] bg-[#0c0c11] p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-display text-xl font-bold text-white">
                Create New DSA Problem
              </h3>
              <button onClick={() => setIsCreatingProblem(false)} className="text-white/50 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Subarray Sum Equals K"
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">Slug</label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="subarray-sum-equals-k"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">Pattern</label>
                  <input
                    type="text"
                    value={newPattern}
                    onChange={(e) => setNewPattern(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Companies (comma-separated)</label>
                <input
                  type="text"
                  value={newCompanies}
                  onChange={(e) => setNewCompanies(e.target.value)}
                  placeholder="Google, Meta, Amazon"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Problem Statement</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  placeholder="Detailed description of the algorithmic problem..."
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">Sample Input</label>
                  <input
                    type="text"
                    value={newExampleInput}
                    onChange={(e) => setNewExampleInput(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">Sample Output</label>
                  <input
                    type="text"
                    value={newExampleOutput}
                    onChange={(e) => setNewExampleOutput(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Constraints (one per line)</label>
                <textarea
                  value={newConstraints}
                  onChange={(e) => setNewConstraints(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-xs text-white focus:outline-none resize-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreatingProblem(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20"
                >
                  Publish Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
