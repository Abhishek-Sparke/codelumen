import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Code, Sparkles, Map, User, MessageSquare, ArrowRight } from 'lucide-react';
import { ALL_PROBLEMS } from '../../data/problems';
import { PATTERNS_DATA } from '../../data/patterns';
import { ROADMAP_STAGES } from '../../data/roadmaps';
import { StorageService } from '../../services/storage';
import { ForumService } from '../../services/forumService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) && !isOpen) {
        // Only open if not inside input/textarea
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        e.preventDefault();
        // Trigger via parent or toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchingProblems = ALL_PROBLEMS.filter(p => 
    !cleanQuery || 
    p.title.toLowerCase().includes(cleanQuery) || 
    p.topic.toLowerCase().includes(cleanQuery) ||
    p.pattern.toLowerCase().includes(cleanQuery) ||
    p.companies.some(c => c.toLowerCase().includes(cleanQuery))
  ).slice(0, 5);

  const matchingPatterns = PATTERNS_DATA.filter(p =>
    !cleanQuery ||
    p.title.toLowerCase().includes(cleanQuery) ||
    p.tagline.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const matchingRoadmaps = ROADMAP_STAGES.filter(r =>
    !cleanQuery ||
    r.title.toLowerCase().includes(cleanQuery) ||
    r.topic.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const matchingUsers = StorageService.getAllUsers().filter(u =>
    !cleanQuery ||
    u.name.toLowerCase().includes(cleanQuery) ||
    u.username.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const matchingDiscussions = ForumService.getThreads().threads.filter(d =>
    !cleanQuery ||
    d.title.toLowerCase().includes(cleanQuery) ||
    d.tags?.some(t => t.toLowerCase().includes(cleanQuery))
  ).slice(0, 3);

  const hasResults = matchingProblems.length > 0 || matchingPatterns.length > 0 || matchingRoadmaps.length > 0 || matchingUsers.length > 0 || matchingDiscussions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 pt-16 sm:pt-24 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
          <Search className="h-5 w-5 text-amber-400/80 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 50+ problems, patterns, roadmaps, discussions..."
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/40 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd 
            onClick={onClose}
            className="cursor-pointer rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/40 hover:bg-white/10"
          >
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!hasResults ? (
            <div className="py-12 text-center text-xs text-white/40">
              No matching problems or topics found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <>
              {/* Problems Group */}
              {matchingProblems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    <Code className="h-3 w-3 text-amber-400" />
                    Problems
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchingProblems.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { onNavigate('workspace', p.id); onClose(); }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.06]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2 w-2 rounded-full ${
                            p.difficulty === 'Easy' ? 'bg-emerald-400' : p.difficulty === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
                          }`} />
                          <span className="font-medium text-white/90">{p.title}</span>
                          <span className="text-[11px] text-white/40">· {p.pattern}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {p.difficulty}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-white/30" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Patterns Group */}
              {matchingPatterns.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    DSA Patterns
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchingPatterns.map(pat => (
                      <button
                        key={pat.id}
                        onClick={() => { onNavigate('patterns', pat.id); onClose(); }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.06]"
                      >
                        <div>
                          <span className="font-medium text-white/90">{pat.title}</span>
                          <p className="text-[11px] text-white/40">{pat.tagline}</p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400">{pat.timeComplexity}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmaps Group */}
              {matchingRoadmaps.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    <Map className="h-3 w-3 text-emerald-400" />
                    Roadmap Stages
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchingRoadmaps.map(r => (
                      <button
                        key={r.id}
                        onClick={() => { onNavigate('roadmaps'); onClose(); }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.06]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-white/40">0{r.order}</span>
                          <span className="font-medium text-white/90">{r.title}</span>
                        </div>
                        <span className="text-[11px] text-white/40">{r.problemIds.length} problems</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Group */}
              {matchingUsers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    <User className="h-3 w-3 text-purple-400" />
                    Developers
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchingUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => { onNavigate('profile', u.id); onClose(); }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.06]"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="h-5 w-5 rounded-full object-cover" />
                          <span className="font-medium text-white/90">{u.name}</span>
                          <span className="text-[11px] text-white/40">@{u.username}</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-semibold">{u.levelTitle}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Discussions Group */}
              {matchingDiscussions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    <MessageSquare className="h-3 w-3 text-blue-400" />
                    Community Discussions
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchingDiscussions.map(d => (
                      <button
                        key={d.id}
                        onClick={() => { onNavigate('discuss', d.id); onClose(); }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.06]"
                      >
                        <span className="font-medium text-white/90 line-clamp-1">{d.title}</span>
                        <span className="text-[11px] text-white/40 shrink-0 ml-2">{d.likes} likes</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.02] px-5 py-2.5 text-[11px] text-white/40">
          <div className="flex items-center gap-4">
            <span>Type to filter</span>
            <span>ESC to close</span>
          </div>
          <span>CodeSpark Global Index</span>
        </div>
      </div>
    </div>
  );
};
