import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MessageSquare, Layers, Cpu, Database, Trophy, Code, Terminal, 
  Coffee, Braces, Globe, Briefcase, FolderGit2, Compass, Lightbulb, 
  Users, Sparkles, Plus, Search, Eye, Heart, ThumbsUp, Flame, 
  Bookmark, BookmarkCheck, Bell, BellOff, Share2, MoreHorizontal, 
  AlertTriangle, Lock, Pin, ChevronRight, ArrowLeft, Quote, 
  Bold, Italic, List, Link as LinkIcon, Check, Copy, User, X,
  Clock, CheckCircle2, Filter, ExternalLink
} from 'lucide-react';
import { 
  DiscussionPost, DiscussionComment, UserProfile, 
  ForumCategory, ForumSection, ForumReactionType, ForumUserRole, ForumAuthor 
} from '../../types';
import { ForumService } from '../../services/forumService';
import { FORUM_CATEGORIES } from '../../data/forumData';

interface DiscussionsViewProps {
  currentUser: UserProfile;
  initialDiscussionId?: string;
  onNavigateProfile?: (userId: string) => void;
  onNavigateProblem?: (problemId: string) => void;
}

type ForumViewMode = 'categories' | 'category-threads' | 'all-threads' | 'thread-detail';
type ThreadFilter = 'all' | 'latest' | 'popular' | 'unanswered' | 'my-discussions' | 'watched';

const CATEGORY_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Layers, Cpu, Database, Trophy, Code, Terminal, Coffee, Braces, Globe,
  Briefcase, FolderGit2, Compass, Lightbulb, Users, Sparkles, MessageSquare
};

export const DiscussionsView: React.FC<DiscussionsViewProps> = ({
  currentUser,
  initialDiscussionId,
  onNavigateProfile,
  onNavigateProblem
}) => {
  // Navigation & view states
  const [viewMode, setViewMode] = useState<ForumViewMode>(() => {
    return initialDiscussionId ? 'thread-detail' : 'all-threads';
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialDiscussionId || null);
  const [activeFilter, setActiveFilter] = useState<ThreadFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [sections, setSections] = useState<ForumSection[]>(() => ForumService.getSections());
  const [categories, setCategories] = useState<ForumCategory[]>(() => ForumService.getCategories());
  const [threads, setThreads] = useState<DiscussionPost[]>(() => ForumService.getThreads());

  // Modals & UI states
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [reportingPost, setReportingPost] = useState<{ id: string; type: 'thread' | 'post' } | null>(null);
  const [reportReason, setReportReason] = useState('Off-topic or spam');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // New thread form state
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('cat-dsa');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadTags, setNewThreadTags] = useState('DSA, Intuition');

  // Reply editor state
  const [replyContent, setReplyContent] = useState('');
  const [replyToPostNumber, setReplyToPostNumber] = useState<number | undefined>(undefined);
  const [replyToAuthor, setReplyToAuthor] = useState<string | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Show toast utility
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reload data
  const refreshData = () => {
    setSections(ForumService.getSections());
    setCategories(ForumService.getCategories());
    setThreads(ForumService.getThreads(
      selectedCategoryId,
      activeFilter,
      searchQuery,
      currentUser.id
    ));
  };

  useEffect(() => {
    refreshData();
  }, [selectedCategoryId, activeFilter, searchQuery]);

  // Handle initial discussion selection
  useEffect(() => {
    if (initialDiscussionId) {
      setSelectedThreadId(initialDiscussionId);
      setViewMode('thread-detail');
    }
  }, [initialDiscussionId]);

  // Current active thread
  const activeThread = useMemo(() => {
    if (!selectedThreadId) return null;
    return ForumService.getThreadById(selectedThreadId);
  }, [selectedThreadId, threads]);

  // Current active category
  const activeCategory = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 'all') return null;
    return ForumService.getCategoryByIdOrSlug(selectedCategoryId);
  }, [selectedCategoryId, categories]);

  // Action handlers
  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setViewMode('category-threads');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setViewMode('thread-detail');
    ForumService.getThreadById(threadId, true); // increment views
    refreshData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategory = () => {
    if (selectedCategoryId && selectedCategoryId !== 'all') {
      setViewMode('category-threads');
    } else {
      setViewMode('all-threads');
    }
  };

  const handleToggleReaction = (postNumber: number, reactionType: ForumReactionType) => {
    if (!selectedThreadId) return;
    const updated = ForumService.toggleReaction(selectedThreadId, postNumber, reactionType, currentUser.id);
    if (updated) {
      refreshData();
    }
  };

  const handleToggleWatch = () => {
    if (!selectedThreadId) return;
    const isWatched = ForumService.toggleWatchThread(selectedThreadId, currentUser.id);
    refreshData();
    showToast(isWatched ? 'Thread added to your Watched list.' : 'Thread removed from Watched.');
  };

  const handleToggleBookmark = () => {
    if (!selectedThreadId) return;
    const isBookmarked = ForumService.toggleBookmarkThread(selectedThreadId, currentUser.id);
    refreshData();
    showToast(isBookmarked ? 'Thread bookmarked!' : 'Bookmark removed.');
  };

  const handleShareThread = () => {
    if (!activeThread) return;
    const url = `${window.location.origin}/discuss/${activeThread.id}`;
    navigator.clipboard.writeText(url);
    showToast('Thread link copied to clipboard!');
  };

  const handleQuotePost = (postNumber: number, authorUsername: string, content: string) => {
    const cleanSnippet = content.split('\n').slice(0, 3).join('\n');
    const quoteBlock = `> **@${authorUsername} said (#${postNumber}):**\n> ${cleanSnippet.replace(/\n/g, '\n> ')}\n\n`;
    setReplyContent(prev => quoteBlock + prev);
    setReplyToPostNumber(postNumber);
    setReplyToAuthor(authorUsername);
    replyTextareaRef.current?.focus();
    replyTextareaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInsertToolbarSnippet = (type: 'bold' | 'italic' | 'code' | 'codeblock' | 'quote' | 'list' | 'link') => {
    const textarea = replyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = replyContent.substring(start, end);

    let insertion = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        insertion = `**${selected || 'bold text'}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        insertion = `*${selected || 'italic text'}*`;
        cursorOffset = 1;
        break;
      case 'code':
        insertion = `\`${selected || 'code'}\``;
        cursorOffset = 1;
        break;
      case 'codeblock':
        insertion = `\n\`\`\`python\n${selected || '# Write your solution or snippet here'}\n\`\`\`\n`;
        cursorOffset = 10;
        break;
      case 'quote':
        insertion = `\n> ${selected || 'Quoted text'}\n`;
        cursorOffset = 3;
        break;
      case 'list':
        insertion = `\n- ${selected || 'List item'}\n`;
        cursorOffset = 3;
        break;
      case 'link':
        insertion = `[${selected || 'link text'}](https://)`;
        cursorOffset = 1;
        break;
    }

    const updated = replyContent.substring(0, start) + insertion + replyContent.substring(end);
    setReplyContent(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 50);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedThreadId) return;

    // Real author metadata for current user
    const authorRole: ForumUserRole = currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'moderator' ? 'Moderator' : 'Member';
    const author: ForumAuthor = {
      id: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      role: authorRole,
      joinedDate: currentUser.joinedDate || 'Apr 2026',
      postCount: (currentUser.solvedProblemIds?.length || 0) + 5,
      levelTitle: currentUser.levelTitle || 'Scholar',
      xp: currentUser.xp || 100,
      problemsSolved: currentUser.solvedProblemIds?.length || 0
    };

    ForumService.addReply(selectedThreadId, replyContent, author, replyToPostNumber, replyToAuthor);
    setReplyContent('');
    setReplyToPostNumber(undefined);
    setReplyToAuthor(undefined);
    refreshData();
    showToast('Your reply was posted successfully!');
  };

  const handleCreateThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const authorRole: ForumUserRole = currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'moderator' ? 'Moderator' : 'Member';
    const author: ForumAuthor = {
      id: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      role: authorRole,
      joinedDate: currentUser.joinedDate || 'Apr 2026',
      postCount: (currentUser.solvedProblemIds?.length || 0) + 1,
      levelTitle: currentUser.levelTitle || 'Scholar',
      xp: currentUser.xp || 100,
      problemsSolved: currentUser.solvedProblemIds?.length || 0
    };

    const newThread = ForumService.createThread({
      title: newThreadTitle.trim(),
      content: newThreadContent.trim(),
      categoryId: newThreadCategory,
      tags: newThreadTags.split(',').map(t => t.trim()).filter(Boolean),
      author
    });

    setIsCreatingThread(false);
    setNewThreadTitle('');
    setNewThreadContent('');
    setSelectedThreadId(newThread.id);
    setViewMode('thread-detail');
    refreshData();
    showToast('Discussion thread created successfully!');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPost) return;
    ForumService.reportContent(reportingPost.id, reportReason, currentUser.id);
    setReportingPost(null);
    showToast('Report submitted. Our moderation team has been notified.');
  };

  // Helper for rendering rich forum markdown text
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-3 leading-relaxed text-sm text-white/85">
        {parts.map((part, idx) => {
          if (part.startsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const lang = lines[0].trim().toLowerCase();
            const code = lines.slice(1).join('\n') || lines[0];

            return (
              <div key={idx} className="my-3 overflow-hidden rounded-xl border border-white/10 bg-[#08080d] font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[11px] text-white/50">
                  <span className="font-semibold text-amber-400/90 uppercase tracking-wider">{lang || 'code'}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      setCopiedPostId(`code-${idx}`);
                      setTimeout(() => setCopiedPostId(null), 2000);
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedPostId === `code-${idx}` ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-4 text-white/90 leading-normal">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }

          // Handle blockquotes
          if (part.startsWith('>')) {
            return (
              <blockquote key={idx} className="border-l-2 border-amber-400/50 bg-amber-400/[0.04] pl-3.5 py-1 text-xs text-white/70 italic rounded-r-lg">
                {part.replace(/^>\s*/gm, '')}
              </blockquote>
            );
          }

          // Format bold and inline code in paragraphs
          const formattedParagraph = part.split('\n\n').map((para, pIdx) => {
            const withCode = para.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-amber-300">$1</code>');
            const withBold = withCode.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
            const withItalic = withBold.replace(/\*([^*]+)\*/g, '<em class="italic text-white/90">$1</em>');

            return (
              <p key={pIdx} dangerouslySetInnerHTML={{ __html: withItalic }} />
            );
          });

          return <React.Fragment key={idx}>{formattedParagraph}</React.Fragment>;
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-[#12121a] px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP FORUM HEADER & NAVIGATION */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d14] p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Forum Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 text-amber-400 shadow-md shadow-amber-400/10">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white">
                  DISCUSSIONS
                </h1>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  FORUM
                </span>
              </div>
              <p className="text-[11px] text-white/50">
                Peer problem breakdowns, algorithmic write-ups, language deep-dives, and interview debriefs.
              </p>
            </div>
          </div>

          {/* Right Action Controls: Search & New Discussion */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-1.5 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-amber-400/50 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCreatingThread(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Discussion</span>
            </button>
          </div>
        </div>

        {/* Compact Navigation Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] pt-3 text-xs">
          <button
            onClick={() => { setViewMode('all-threads'); setSelectedCategoryId('all'); setActiveFilter('all'); }}
            className={`rounded-lg px-3 py-1 font-medium transition-colors ${
              viewMode === 'all-threads' && activeFilter === 'all'
                ? 'bg-amber-400/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            All Discussions
          </button>

          <button
            onClick={() => { setViewMode('categories'); setSelectedCategoryId('all'); }}
            className={`rounded-lg px-3 py-1 font-medium transition-colors ${
              viewMode === 'categories'
                ? 'bg-amber-400/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => { setViewMode('all-threads'); setActiveFilter('latest'); }}
            className={`rounded-lg px-3 py-1 font-medium transition-colors ${
              viewMode === 'all-threads' && activeFilter === 'latest'
                ? 'bg-amber-400/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Latest
          </button>

          <button
            onClick={() => { setViewMode('all-threads'); setActiveFilter('popular'); }}
            className={`rounded-lg px-3 py-1 font-medium transition-colors ${
              viewMode === 'all-threads' && activeFilter === 'popular'
                ? 'bg-amber-400/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Popular
          </button>

          <button
            onClick={() => { setViewMode('all-threads'); setActiveFilter('unanswered'); }}
            className={`rounded-lg px-3 py-1 font-medium transition-colors ${
              viewMode === 'all-threads' && activeFilter === 'unanswered'
                ? 'bg-amber-400/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Unanswered
          </button>

          <button
            onClick={() => { setViewMode('all-threads'); setActiveFilter('my-discussions'); }}
            className={`rounded-lg px-3 py-1 font-medium transition-colors ${
              viewMode === 'all-threads' && activeFilter === 'my-discussions'
                ? 'bg-amber-400/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            My Discussions
          </button>

          <button
            onClick={() => { setViewMode('all-threads'); setActiveFilter('watched'); }}
            className={`rounded-lg px-3 py-1 font-medium transition-colors flex items-center gap-1 ${
              viewMode === 'all-threads' && activeFilter === 'watched'
                ? 'bg-amber-400/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="h-3 w-3" />
            <span>Watched</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CATEGORY / FORUM INDEX OVERVIEW */}
      {viewMode === 'categories' && (
        <div className="space-y-6 animate-in fade-in">
          {sections.map(section => (
            <div key={section.id} className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] overflow-hidden shadow-lg">
              {/* Section Header */}
              <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
                <h2 className="font-display text-sm font-bold tracking-wider text-amber-400 uppercase">
                  {section.title}
                </h2>
                <p className="text-xs text-white/50 mt-0.5">{section.description}</p>
              </div>

              {/* Forum Category Rows */}
              <div className="divide-y divide-white/[0.04]">
                {section.categories.map(cat => {
                  const IconComp = CATEGORY_ICON_MAP[cat.iconName] || Layers;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-amber-300 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 transition-colors">
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                            <span>{cat.name}</span>
                          </h3>
                          <p className="text-xs text-white/50 line-clamp-1 mt-0.5">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Stats & Latest Post */}
                      <div className="flex items-center gap-6 text-xs text-white/40 shrink-0 sm:pl-4">
                        <div className="text-right hidden md:block w-24">
                          <div className="font-semibold text-white/80">{cat.threadCount}</div>
                          <div className="text-[10px] text-white/40">threads</div>
                        </div>
                        <div className="text-right hidden md:block w-20">
                          <div className="font-semibold text-white/80">{cat.postCount}</div>
                          <div className="text-[10px] text-white/40">posts</div>
                        </div>
                        <div className="w-56 text-right sm:text-left min-w-0 hidden lg:block">
                          {cat.latestThread ? (
                            <div className="text-[11px] truncate">
                              <span className="text-white/80 hover:underline">{cat.latestThread.title}</span>
                              <div className="text-white/40 text-[10px]">
                                by {cat.latestThread.authorName} · {cat.latestThread.lastActivity}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-white/30 italic">No posts yet</span>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-amber-300 transition-colors shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: CATEGORY THREAD LIST OR ALL THREADS */}
      {(viewMode === 'category-threads' || viewMode === 'all-threads') && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Breadcrumb & Category Header */}
          {viewMode === 'category-threads' && activeCategory && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                <button onClick={() => setViewMode('categories')} className="hover:text-white transition-colors">
                  Discussions
                </button>
                <span>/</span>
                <span className="text-white/40 uppercase text-[10px] tracking-wider">{activeCategory.sectionId}</span>
                <span>/</span>
                <span className="text-amber-300 font-semibold">{activeCategory.name}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{activeCategory.name}</h2>
                  <p className="text-xs text-white/60 mt-1">{activeCategory.description}</p>
                </div>
                <button
                  onClick={() => {
                    setNewThreadCategory(activeCategory.id);
                    setIsCreatingThread(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 transition-colors shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Post to {activeCategory.name}</span>
                </button>
              </div>
            </div>
          )}

          {/* Compact Thread Table / List */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] overflow-hidden shadow-lg">
            
            {/* Table Header */}
            <div className="hidden sm:flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 text-[11px] font-semibold text-white/40 tracking-wider uppercase">
              <div className="flex-1">Topic / Discussion</div>
              <div className="flex items-center gap-8 pr-2">
                <span className="w-16 text-center">Replies</span>
                <span className="w-16 text-center">Views</span>
                <span className="w-28 text-right">Activity</span>
              </div>
            </div>

            {/* Thread Rows */}
            {threads.length === 0 ? (
              <div className="p-12 text-center text-xs text-white/40">
                <MessageSquare className="mx-auto h-8 w-8 text-white/20 mb-2" />
                <p>No discussions found matching your current filter.</p>
                <button
                  onClick={() => setIsCreatingThread(true)}
                  className="mt-3 text-amber-400 hover:underline font-semibold"
                >
                  Start the first discussion →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {threads.map(thread => (
                  <div
                    key={thread.id}
                    onClick={() => handleOpenThread(thread.id)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    {/* Left: Status Icon, Title, Author, Tags */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        {thread.isPinned ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300">
                            <Pin className="h-3 w-3" />
                          </div>
                        ) : thread.isLocked ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white/40">
                            <Lock className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-white/40 group-hover:text-amber-300 transition-colors">
                            <MessageSquare className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {thread.isPinned && (
                            <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                              PINNED
                            </span>
                          )}
                          <h3 className="font-medium text-sm text-white group-hover:text-amber-300 transition-colors">
                            {thread.title}
                          </h3>
                        </div>

                        {/* Metadata row */}
                        <div className="mt-1 flex items-center gap-2 text-xs text-white/50 flex-wrap">
                          <span className="text-white/80 font-medium">{thread.author.name}</span>
                          <span>·</span>
                          <span className="text-amber-400/80 text-[11px]">{thread.categoryName || 'General'}</span>
                          <span>·</span>
                          <span className="text-white/40 text-[11px]">{thread.createdAt}</span>

                          {thread.tags && thread.tags.slice(0, 2).map((tag, tIdx) => (
                            <span key={tIdx} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Counters & Last reply */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-white/50 shrink-0 pl-9 sm:pl-0">
                      <div className="flex sm:hidden items-center gap-4 text-white/40 text-[11px]">
                        <span>{thread.commentsCount || 0} replies</span>
                        <span>{thread.views || 1} views</span>
                      </div>

                      <div className="w-16 text-center font-semibold text-white/80 hidden sm:block">
                        {thread.commentsCount || 0}
                      </div>

                      <div className="w-16 text-center font-semibold text-white/60 hidden sm:block">
                        {thread.views || 1}
                      </div>

                      <div className="w-28 text-right text-[11px] text-white/40">
                        {thread.lastActivityAt || thread.createdAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: THREAD DETAIL PAGE (CLASSIC FORUM POST LAYOUT) */}
      {viewMode === 'thread-detail' && activeThread && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Breadcrumbs & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2 text-xs text-white/50 flex-wrap">
              <button onClick={handleBackToCategory} className="flex items-center gap-1 hover:text-white transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <span>/</span>
              <button onClick={() => setViewMode('categories')} className="hover:text-white transition-colors">
                Discussions
              </button>
              <span>/</span>
              <span className="text-white/40">{activeThread.categoryName}</span>
              <span>/</span>
              <span className="text-amber-300 font-semibold truncate max-w-xs">{activeThread.title}</span>
            </div>

            {/* Thread Controls: Watch, Share, More */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleWatch}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {activeThread.watchedByUserIds?.includes(currentUser.id) ? (
                  <>
                    <BellOff className="h-3.5 w-3.5 text-amber-400" />
                    <span>Unwatch</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-3.5 w-3.5" />
                    <span>Watch</span>
                  </>
                )}
              </button>

              <button
                onClick={handleToggleBookmark}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {activeThread.bookmarkedByUserIds?.includes(currentUser.id) ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
                <span>Bookmark</span>
              </button>

              <button
                onClick={handleShareThread}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setReportingPost({ id: activeThread.id, type: 'thread' })}
                className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Report discussion"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Thread Header Banner */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="rounded bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    {activeThread.categoryName || 'General'}
                  </span>
                  {activeThread.isPinned && (
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      PINNED
                    </span>
                  )}
                  {activeThread.isLocked && (
                    <span className="rounded bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      LOCKED
                    </span>
                  )}
                  {activeThread.problemId && onNavigateProblem && (
                    <button
                      onClick={() => onNavigateProblem(activeThread.problemId!)}
                      className="rounded bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300 hover:bg-purple-500/25 transition-colors flex items-center gap-1"
                    >
                      <span>Problem: {activeThread.problemTitle || activeThread.problemId}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>

                <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white">
                  {activeThread.title}
                </h1>

                <div className="mt-2 flex items-center gap-3 text-xs text-white/50 flex-wrap">
                  <span>Started by <strong className="text-white">{activeThread.author.name}</strong></span>
                  <span>·</span>
                  <span>{activeThread.createdAt}</span>
                  <span>·</span>
                  <span>{activeThread.views || 1} views</span>
                  <span>·</span>
                  <span>{(activeThread.comments?.length || 0) + 1} total posts</span>
                </div>
              </div>
            </div>

            {activeThread.isLocked && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
                <Lock className="h-4 w-4 text-red-400 shrink-0" />
                <span>This discussion is closed for further replies.</span>
              </div>
            )}
          </div>

          {/* POSTS LIST (ORIGINAL POST + REPLIES) */}
          <div className="space-y-4">
            
            {/* 1. ORIGINAL POST (#1) */}
            <div id="post-1" className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] overflow-hidden shadow-xl">
              <div className="flex flex-col md:flex-row">
                
                {/* LEFT: USER PROFILE COLUMN */}
                <div className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#08080d] p-4 sm:p-5 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4">
                  <div className="flex md:flex-col items-center md:items-start gap-3">
                    <div className="relative">
                      <img
                        src={activeThread.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={activeThread.author.name}
                        className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#08080d] bg-emerald-500" />
                    </div>
                    <div>
                      <button
                        onClick={() => onNavigateProfile && onNavigateProfile(activeThread.author.id)}
                        className="font-bold text-sm text-white hover:text-amber-400 transition-colors text-left"
                      >
                        {activeThread.author.name}
                      </button>
                      <div className="text-[11px] text-white/40">@{activeThread.author.username}</div>
                      
                      <span className={`inline-block mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        activeThread.author.role === 'Admin'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : activeThread.author.role === 'Moderator'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : activeThread.author.role === 'Contributor'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/10 text-white/60 border border-white/10'
                      }`}>
                        {activeThread.author.role || 'Member'}
                      </span>
                    </div>
                  </div>

                  {/* Author Statistics */}
                  <div className="hidden md:flex flex-col gap-1.5 border-t border-white/[0.06] pt-3 mt-1 text-[11px] text-white/50 w-full">
                    <div className="flex justify-between">
                      <span>Joined:</span>
                      <span className="text-white/70 font-medium">{activeThread.author.joinedDate || 'Jan 2025'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Posts:</span>
                      <span className="text-white/70 font-medium">{activeThread.author.postCount || 42}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>XP:</span>
                      <span className="text-amber-400 font-semibold">{activeThread.author.xp?.toLocaleString() || '1,200'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Solved:</span>
                      <span className="text-emerald-400 font-semibold">{activeThread.author.problemsSolved || 14}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: POST BODY & ACTIONS */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    {/* Post Top Header */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs text-white/40 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-white/30" />
                        <span>{activeThread.createdAt}</span>
                      </div>
                      <a href="#post-1" className="font-mono text-amber-400/80 hover:text-amber-300 font-semibold">
                        #1
                      </a>
                    </div>

                    {/* Post Formatted Content */}
                    {renderFormattedContent(activeThread.content)}
                  </div>

                  {/* Post Bottom Actions & Reactions */}
                  <div className="mt-6 border-t border-white/[0.06] pt-4 flex flex-wrap items-center justify-between gap-3">
                    {/* Reactions Bar */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['like', 'love', 'helpful', 'great'] as ForumReactionType[]).map(type => {
                        const count = activeThread.reactions?.[type]?.length || 0;
                        const hasReacted = activeThread.reactions?.[type]?.includes(currentUser.id);
                        const emoji = type === 'like' ? '👍' : type === 'love' ? '❤️' : type === 'helpful' ? '💡' : '🔥';
                        const label = type === 'like' ? 'Like' : type === 'love' ? 'Love' : type === 'helpful' ? 'Helpful' : 'Great';

                        return (
                          <button
                            key={type}
                            onClick={() => handleToggleReaction(1, type)}
                            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all ${
                              hasReacted
                                ? 'bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold'
                                : 'bg-white/5 border border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                            }`}
                            title={`${label} (${count})`}
                          >
                            <span>{emoji}</span>
                            <span className="text-[11px] font-mono">{count}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Subtle Actions */}
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <button
                        onClick={() => {
                          replyTextareaRef.current?.focus();
                          replyTextareaRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Reply</span>
                      </button>

                      <button
                        onClick={() => handleQuotePost(1, activeThread.author.username, activeThread.content)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Quote className="h-3.5 w-3.5" />
                        <span>Quote</span>
                      </button>

                      <button
                        onClick={() => setReportingPost({ id: activeThread.id, type: 'thread' })}
                        className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                        title="Report"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-white/40 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. REPLIES LIST (#2, #3, ...) */}
            {activeThread.comments && activeThread.comments.map((comment, cIdx) => {
              const postNumber = comment.postNumber || cIdx + 2;

              return (
                <div
                  key={comment.id}
                  id={`post-${postNumber}`}
                  className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] overflow-hidden shadow-lg"
                >
                  <div className="flex flex-col md:flex-row">
                    
                    {/* LEFT PROFILE COLUMN */}
                    <div className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#08080d] p-4 sm:p-5 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4">
                      <div className="flex md:flex-col items-center md:items-start gap-3">
                        <div className="relative">
                          <img
                            src={comment.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={comment.author.name}
                            className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10"
                          />
                          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#08080d] bg-emerald-500" />
                        </div>
                        <div>
                          <button
                            onClick={() => onNavigateProfile && onNavigateProfile(comment.author.id)}
                            className="font-bold text-sm text-white hover:text-amber-400 transition-colors text-left"
                          >
                            {comment.author.name}
                          </button>
                          <div className="text-[11px] text-white/40">@{comment.author.username}</div>
                          
                          <span className={`inline-block mt-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            comment.author.role === 'Admin'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : comment.author.role === 'Moderator'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : comment.author.role === 'Contributor'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-white/10 text-white/60 border border-white/10'
                          }`}>
                            {comment.author.role || 'Member'}
                          </span>
                        </div>
                      </div>

                      {/* Author Stats */}
                      <div className="hidden md:flex flex-col gap-1.5 border-t border-white/[0.06] pt-3 mt-1 text-[11px] text-white/50 w-full">
                        <div className="flex justify-between">
                          <span>Joined:</span>
                          <span className="text-white/70 font-medium">{comment.author.joinedDate || 'Feb 2025'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Posts:</span>
                          <span className="text-white/70 font-medium">{comment.author.postCount || 28}</span>
                        </div>
                        {comment.author.xp && (
                          <div className="flex justify-between">
                            <span>XP:</span>
                            <span className="text-amber-400 font-semibold">{comment.author.xp.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT POST BODY & ACTIONS */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                      <div>
                        {/* Header with date and post number */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs text-white/40 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-white/30" />
                            <span>{comment.createdAt}</span>
                            {comment.replyToAuthor && (
                              <span className="text-amber-400/80 text-[11px]">
                                in reply to @{comment.replyToAuthor} (#{comment.replyToPostNumber})
                              </span>
                            )}
                          </div>
                          <a href={`#post-${postNumber}`} className="font-mono text-white/40 hover:text-amber-300 font-semibold">
                            #{postNumber}
                          </a>
                        </div>

                        {/* Content */}
                        {renderFormattedContent(comment.content)}
                      </div>

                      {/* Bottom reactions and actions */}
                      <div className="mt-6 border-t border-white/[0.06] pt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(['like', 'love', 'helpful', 'great'] as ForumReactionType[]).map(type => {
                            const count = comment.reactions?.[type]?.length || 0;
                            const hasReacted = comment.reactions?.[type]?.includes(currentUser.id);
                            const emoji = type === 'like' ? '👍' : type === 'love' ? '❤️' : type === 'helpful' ? '💡' : '🔥';
                            const label = type === 'like' ? 'Like' : type === 'love' ? 'Love' : type === 'helpful' ? 'Helpful' : 'Great';

                            return (
                              <button
                                key={type}
                                onClick={() => handleToggleReaction(postNumber, type)}
                                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all ${
                                  hasReacted
                                    ? 'bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold'
                                    : 'bg-white/5 border border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                }`}
                                title={`${label} (${count})`}
                              >
                                <span>{emoji}</span>
                                <span className="text-[11px] font-mono">{count}</span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <button
                            onClick={() => {
                              setReplyToPostNumber(postNumber);
                              setReplyToAuthor(comment.author.username);
                              replyTextareaRef.current?.focus();
                              replyTextareaRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex items-center gap-1 rounded-lg px-2.5 py-1 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Reply</span>
                          </button>

                          <button
                            onClick={() => handleQuotePost(postNumber, comment.author.username, comment.content)}
                            className="flex items-center gap-1 rounded-lg px-2.5 py-1 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Quote className="h-3.5 w-3.5" />
                            <span>Quote</span>
                          </button>

                          <button
                            onClick={() => setReportingPost({ id: comment.id, type: 'post' })}
                            className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                            title="Report"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 text-white/40 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* REPLY EDITOR SYSTEM */}
          {!activeThread.isLocked ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">
                    {replyToAuthor ? `Replying to @${replyToAuthor} (#${replyToPostNumber})` : 'Reply to Discussion'}
                  </h3>
                  {replyToAuthor && (
                    <button
                      onClick={() => { setReplyToAuthor(undefined); setReplyToPostNumber(undefined); }}
                      className="text-xs text-white/40 hover:text-white ml-2 underline"
                    >
                      Cancel reply link
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs font-semibold text-white/50 hover:text-white transition-colors"
                >
                  {showPreview ? 'Edit Message' : 'Preview'}
                </button>
              </div>

              {/* Rich Formatting Toolbar */}
              <div className="flex items-center gap-1 border-b border-white/[0.06] pb-2.5 mb-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleInsertToolbarSnippet('bold')}
                  className="rounded p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertToolbarSnippet('italic')}
                  className="rounded p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <span className="h-4 w-px bg-white/10 mx-1" />
                <button
                  type="button"
                  onClick={() => handleInsertToolbarSnippet('code')}
                  className="rounded px-1.5 py-0.5 font-mono text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Inline Code"
                >
                  `code`
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertToolbarSnippet('codeblock')}
                  className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-amber-300 font-semibold bg-amber-400/10 hover:bg-amber-400/20 transition-colors"
                  title="Insert Python / Language Code Block"
                >
                  <Code className="h-3.5 w-3.5" />
                  <span>Code Block</span>
                </button>
                <span className="h-4 w-px bg-white/10 mx-1" />
                <button
                  type="button"
                  onClick={() => handleInsertToolbarSnippet('quote')}
                  className="rounded p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Quote"
                >
                  <Quote className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertToolbarSnippet('list')}
                  className="rounded p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="List Item"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertToolbarSnippet('link')}
                  className="rounded p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Link"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Textarea or Preview */}
              {showPreview ? (
                <div className="min-h-[140px] rounded-xl border border-white/10 bg-[#08080d] p-4 text-sm text-white/90">
                  {replyContent.trim() ? (
                    renderFormattedContent(replyContent)
                  ) : (
                    <span className="text-xs text-white/30 italic">Nothing to preview.</span>
                  )}
                </div>
              ) : (
                <textarea
                  ref={replyTextareaRef}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your thought, explanation, or code snippet (supports Markdown & code blocks)..."
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-[#08080d] p-3.5 text-sm text-white placeholder-white/30 focus:border-amber-400/50 focus:outline-none font-sans leading-relaxed"
                />
              )}

              {/* Submit Row */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-white/40">
                  Tip: Code blocks formatted with ```python ``` will render with copy buttons and syntax blocks.
                </span>
                <button
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim()}
                  className={`rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all ${
                    !replyContent.trim() ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  Post Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-6 text-center text-xs text-white/40">
              <Lock className="mx-auto h-6 w-6 text-white/30 mb-2" />
              <span>This discussion has been locked by a moderator. No new replies can be added.</span>
            </div>
          )}

        </div>
      )}

      {/* MODAL 1: CREATE NEW DISCUSSION */}
      {isCreatingThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0f0f18] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-400" />
                <h2 className="font-display text-lg font-bold text-white">Create New Discussion</h2>
              </div>
              <button onClick={() => setIsCreatingThread(false)} className="text-white/40 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThreadSubmit} className="space-y-4 text-xs">
              {/* Category selector */}
              <div>
                <label className="block text-white/70 font-semibold mb-1">Forum Category</label>
                <select
                  value={newThreadCategory}
                  onChange={(e) => setNewThreadCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#08080d] p-2.5 text-white focus:border-amber-400/50 focus:outline-none"
                >
                  {sections.map(sec => (
                    <optgroup key={sec.id} label={sec.title}>
                      {sec.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.description.slice(0, 40)}...)
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-white/70 font-semibold mb-1">Discussion Title</label>
                <input
                  type="text"
                  placeholder="e.g. How should I optimize this sliding window approach?"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#08080d] p-2.5 text-white placeholder-white/30 focus:border-amber-400/50 focus:outline-none text-sm"
                  required
                />
              </div>

              {/* Content textarea with instructions */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-white/70 font-semibold">Post Body</label>
                  <span className="text-[10px] text-amber-400/80">Supports Markdown & ```code blocks```</span>
                </div>
                <textarea
                  placeholder="Explain your approach, paste your code with ```python or ```javascript, and ask your questions..."
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  rows={7}
                  className="w-full rounded-xl border border-white/10 bg-[#08080d] p-3 text-white placeholder-white/30 focus:border-amber-400/50 focus:outline-none font-sans text-xs leading-relaxed"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white/70 font-semibold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. DSA, Python, Sliding Window, Interview"
                  value={newThreadTags}
                  onChange={(e) => setNewThreadTags(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#08080d] p-2.5 text-white placeholder-white/30 focus:border-amber-400/50 focus:outline-none text-xs"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingThread(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newThreadTitle.trim() || !newThreadContent.trim()}
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REPORT CONTENT */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0f0f18] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Report Inappropriate Content</span>
              </div>
              <button onClick={() => setReportingPost(null)} className="text-white/40 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <p className="text-white/60">
                Please let us know why this content should be reviewed by our moderation team:
              </p>

              <div className="space-y-2">
                {['Off-topic or spam', 'Harassment or rude behavior', 'Incorrect or malicious code', 'Cheating / Contest leak'].map(reason => (
                  <label key={reason} className="flex items-center gap-2 p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 cursor-pointer text-white/80">
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="text-amber-400 focus:ring-0"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingPost(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 font-semibold text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-500 px-4 py-1.5 font-bold text-white hover:bg-red-600 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
