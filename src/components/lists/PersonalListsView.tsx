import React, { useState, useMemo } from 'react';
import {
  Plus, Trash2, List, Layers, Edit3, CheckCircle2, Circle,
  Lock, Unlock, ArrowRight, X, GripVertical
} from 'lucide-react';
import { UserProfile, PersonalProblemList } from '../../types';
import { StorageService } from '../../services/storage';
import { ALL_PROBLEMS } from '../../data/problems';

interface PersonalListsViewProps {
  currentUser: UserProfile;
  onNavigate: (view: string, param?: string) => void;
}

export const PersonalListsView: React.FC<PersonalListsViewProps> = ({ currentUser, onNavigate }) => {
  const [lists, setLists] = useState<PersonalProblemList[]>(
    () => StorageService.getPersonalLists(currentUser.id)
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  const refreshLists = () => {
    setLists(StorageService.getPersonalLists(currentUser.id));
  };

  const createList = () => {
    if (!newListTitle.trim()) return;
    const list: PersonalProblemList = {
      id: `list_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      title: newListTitle.trim(),
      description: newListDesc.trim() || undefined,
      isPublic: false,
      problemIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.savePersonalList(list);
    setNewListTitle('');
    setNewListDesc('');
    setShowCreateModal(false);
    refreshLists();
  };

  const deleteList = (listId: string) => {
    if (!confirm('Delete this list? This cannot be undone.')) return;
    StorageService.deletePersonalList(currentUser.id, listId);
    refreshLists();
  };

  const removeProblem = (listId: string, problemId: string) => {
    StorageService.removeProblemFromList(currentUser.id, listId, problemId);
    refreshLists();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold text-teal-400">
            <Layers className="h-3 w-3" />
            <span>Personal Collection</span>
          </div>
          <h1 className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            My Problem Lists
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Organize problems into custom lists for focused practice.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-2.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/15 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New List
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#12121a] p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Create New List</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-white/30 hover:text-white/60">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={newListTitle}
                onChange={e => setNewListTitle(e.target.value)}
                placeholder="List name"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/40"
                autoFocus
              />
              <textarea
                value={newListDesc}
                onChange={e => setNewListDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm text-white placeholder-white/30 resize-none h-16 focus:outline-none focus:border-teal-500/40"
              />
            </div>
            <button
              onClick={createList}
              disabled={!newListTitle.trim()}
              className="w-full rounded-xl bg-teal-500/15 border border-teal-500/25 px-4 py-2.5 text-xs font-bold text-teal-300 hover:bg-teal-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Create List
            </button>
          </div>
        </div>
      )}

      {/* Lists */}
      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30 space-y-3">
          <List className="h-12 w-12 text-white/10" />
          <p className="text-sm">No lists yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map(list => {
            const isExpanded = expandedListId === list.id;
            const solvedCount = list.problemIds.filter(id => currentUser.solvedProblemIds.includes(id)).length;
            return (
              <div key={list.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setExpandedListId(isExpanded ? null : list.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-white">{list.title}</h3>
                      {list.description && (
                        <p className="text-[10px] text-white/40 mt-0.5">{list.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40">
                      {solvedCount}/{list.problemIds.length} solved
                    </span>
                    <div className="flex items-center gap-1">
                      {list.isPublic ? (
                        <Unlock className="h-3 w-3 text-white/20" />
                      ) : (
                        <Lock className="h-3 w-3 text-white/20" />
                      )}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteList(list.id); }}
                      className="text-white/15 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-white/[0.06]">
                    {list.problemIds.length === 0 ? (
                      <div className="px-5 py-8 text-center text-xs text-white/30">
                        No problems in this list yet. Add problems from the Problem Library.
                      </div>
                    ) : (
                      list.problemIds.map(pid => {
                        const problem = ALL_PROBLEMS.find(p => p.id === pid);
                        if (!problem) return null;
                        const isSolved = currentUser.solvedProblemIds.includes(pid);
                        const diffColor = problem.difficulty === 'Easy' ? 'text-emerald-400' : problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400';
                        return (
                          <div
                            key={pid}
                            className="flex items-center gap-3 px-5 py-2.5 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors group"
                          >
                            {isSolved ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-white/20 shrink-0" />
                            )}
                            <button
                              onClick={() => onNavigate('workspace', pid)}
                              className="flex-1 text-left text-xs font-medium text-white hover:text-amber-300 transition-colors truncate"
                            >
                              {problem.title}
                            </button>
                            <span className={`text-[10px] font-bold ${diffColor}`}>{problem.difficulty}</span>
                            <span className="text-[10px] text-white/30">{problem.topic}</span>
                            <button
                              onClick={() => removeProblem(list.id, pid)}
                              className="text-white/10 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
