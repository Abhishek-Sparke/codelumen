import React, { useEffect, useState } from 'react';
import {
  Code,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Archive,
  Eye,
  ExternalLink,
  Check,
  X,
  RefreshCw,
  Play,
  FileCode,
  Tag
} from 'lucide-react';
import { UserProfile, Problem, Difficulty, ProblemLifecycleState } from '../../../types';
import { AdminService } from '../../../services/adminService';
import { Link } from '../../../router/Link';

interface AdminProblemsViewProps {
  currentUser: UserProfile;
  onNavigateProblem: (problemId: string) => void;
}

export const AdminProblemsView: React.FC<AdminProblemsViewProps> = ({
  currentUser,
  onNavigateProblem
}) => {
  const [problems, setProblems] = useState<(Problem & { lifecycleState: ProblemLifecycleState })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Problem creation modal state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('Easy');
  const [newTopic, setNewTopic] = useState('Arrays');
  const [newPattern, setNewPattern] = useState('Two Pointers');
  const [newDescription, setNewDescription] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchProblems = async () => {
    setLoading(true);
    const res = await AdminService.getProblems(currentUser, {
      search: searchQuery,
      lifecycle: lifecycleFilter
    });
    if (res.success && res.problems) {
      setProblems(res.problems);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, [searchQuery, lifecycleFilter]);

  const handleToggleLifecycle = async (problemId: string, currentState: ProblemLifecycleState) => {
    if (currentState === 'published') {
      const res = await AdminService.archiveProblem(currentUser, problemId);
      if (res.success) {
        showToast(`Problem ${problemId} archived.`);
        fetchProblems();
      }
    } else {
      const res = await AdminService.publishProblem(currentUser, problemId);
      if (res.success) {
        showToast(`Problem ${problemId} published to live catalogue.`);
        fetchProblems();
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
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
      companies: ['Google', 'Meta'],
      description: newDescription || 'Problem specification and constraints.',
      examples: [
        { input: 'nums = [1, 2, 3], target = 5', output: '[1, 2]' }
      ],
      constraints: ['1 <= nums.length <= 10^5'],
      starterCode: {
        javascript: `function ${slug.replace(/-/g, '_')}(nums, target) {\n  // Solution\n}`,
        python: `def ${slug.replace(/-/g, '_')}(nums: list[int], target: int) -> list[int]:\n    pass`,
        cpp: `class Solution { public: void solve() {} };`,
        java: `class Solution { public void solve() {} }`,
        go: `func solve() {}`,
        rust: `impl Solution { pub fn solve() {} }`
      },
      testCases: [
        { input: [[1, 2, 3], 5], expected: [1, 2] }
      ],
      hints: [
        { level: 1, type: 'conceptual', title: 'Two Pointer Invariants', content: 'Consider sorting or two pointers.' }
      ],
      editorial: {
        summary: `Official analysis for ${newTitle}`,
        patternExplanation: `Demonstrates ${newPattern} technique.`,
        bruteForce: {
          name: 'Brute Force Enumeration',
          complexity: { time: 'O(n²)', space: 'O(1)' },
          explanation: 'Exhaustive pairwise examination.',
          code: '// Brute force'
        },
        optimal: {
          name: 'Optimal Linear Pass',
          complexity: { time: 'O(n)', space: 'O(1)' },
          explanation: 'Optimized single pass algorithm.',
          code: '// Optimal solution'
        }
      },
      similarProblemIds: ['p-1']
    };

    // Auto-publish and save
    AdminService.publishProblem(currentUser, created.id);
    showToast(`Created & published "${newTitle}"!`);
    setIsCreating(false);
    fetchProblems();
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
            <Code className="h-6 w-6 text-amber-400" />
            Problem CMS & Lifecycle
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Publish, archive, and manage coding challenge lifecycles, test suites, and starter code templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            New Problem
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search problems by title, slug, or algorithmic topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400/50"
          />
        </div>

        <select
          value={lifecycleFilter}
          onChange={(e) => setLifecycleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs focus:outline-none focus:border-amber-400/50"
        >
          <option value="all">All Lifecycles</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-white/40 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Topic / Pattern</th>
                <th className="py-3 px-4">Lifecycle State</th>
                <th className="py-3 px-4">Test Cases</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40">
                    Loading problems...
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40">
                    No problems matching filter.
                  </td>
                </tr>
              ) : (
                problems.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-white">{p.title}</div>
                        <div className="text-white/40 font-mono text-[11px]">{p.slug}</div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : p.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {p.difficulty}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-white/70">
                      <div>{p.topic}</div>
                      <div className="text-[11px] text-white/40">{p.pattern}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        p.lifecycleState === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : p.lifecycleState === 'archived'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {p.lifecycleState || 'published'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-white/60 font-mono">
                      {p.testCases?.length || 2} configured
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigateProblem(p.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-medium border border-white/10 flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3 text-white/60" />
                          View
                        </button>
                        <button
                          onClick={() => handleToggleLifecycle(p.id, p.lifecycleState)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            p.lifecycleState === 'published'
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {p.lifecycleState === 'published' ? 'Archive' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Problem Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-xl w-full rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-amber-400" />
                Add New Problem
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 rounded-lg text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Invert Binary Tree"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Pattern</label>
                <input
                  type="text"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Description (Markdown)</label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Problem statement and details..."
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold flex items-center gap-1.5 shadow-md"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
