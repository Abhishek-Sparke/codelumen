import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MessageSquare, Layers, Cpu, Database, Trophy, Code, Terminal, 
  Coffee, Braces, Globe, Briefcase, FolderGit2, Compass, Lightbulb, 
  Users, Sparkles, Plus, Search, 
  Bookmark, BookmarkCheck, Bell, Share2, 
  AlertTriangle, Lock, Unlock, Pin, ChevronRight, ArrowLeft, Quote, 
  Bold, Italic, List, Link as LinkIcon, Check, Copy, X,
  Clock, CheckCircle2, ChevronLeft, Trash2, Shield
} from 'lucide-react';
import type { 
  UserProfile, 
  ForumCategory, ForumSection, ForumReactionType, ForumUserRole, ForumAuthor 
} from '../../types';
import { ForumService } from '../../services/forumService';
import { SecuritySanitizer, type CodeToken } from '../../services/securitySanitizer';
import { Link } from '../../router/Link';
import { navigate } from '../../router/router';
import { NotFoundView } from '../common/NotFoundView';
import { FeatureFlagService } from '../../services/featureFlags';

interface DiscussionsViewProps {
  currentUser: UserProfile | null;
  initialDiscussionId?: string;
  initialCategorySlug?: string;
  onNavigateProfile?: (userId: string) => void;
  onNavigateProblem?: (problemId: string) => void;
  onRequireAuth?: () => void;
  onNavigateDiscussion?: (slugOrId?: string) => void;
}

type ForumViewMode = 'categories' | 'category-threads' | 'all-threads' | 'thread-detail';
type ThreadFilter = 'all' | 'latest' | 'popular' | 'unanswered' | 'solved' | 'saved' | 'my-discussions' | 'watched';
type CategoryFilter = 'latest' | 'popular' | 'unanswered' | 'solved';

const CATEGORY_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Layers, Cpu, Database, Trophy, Code, Terminal, Coffee, Braces, Globe,
  Briefcase, FolderGit2, Compass, Lightbulb, Users, Sparkles, MessageSquare
};

export const DiscussionsView: React.FC<DiscussionsViewProps> = ({
  currentUser,
  initialDiscussionId,
  initialCategorySlug,
  onNavigateProfile,
  onNavigateProblem,
  onRequireAuth,
  onNavigateDiscussion
}) => {
  // Navigation & view states
  const [viewMode, setViewMode] = useState<ForumViewMode>(() => {
    if (initialDiscussionId) return 'thread-detail';
    if (initialCategorySlug) return 'category-threads';
    return 'categories';
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    if (initialCategorySlug) {
      const cat = ForumService.getCategoryByIdOrSlug(initialCategorySlug);
      return cat ? cat.id : initialCategorySlug;
    }
    return 'all';
  });
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialDiscussionId || null);
  const [activeFilter, setActiveFilter] = useState<ThreadFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);

  // Data states
  const [sections, setSections] = useState<ForumSection[]>(() => ForumService.getSections());
  const [categories, setCategories] = useState<ForumCategory[]>(() => ForumService.getCategories());

  // Modals & UI states
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [reportingPost, setReportingPost] = useState<{ id: string; type: 'thread' | 'post' } | null>(null);
  const [reportReason, setReportReason] = useState('Off-topic or spam');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [isModeratorMenuOpen, setIsModeratorMenuOpen] = useState(false);

  // New thread form state
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('cat-dsa');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadTags, setNewThreadTags] = useState('DSA, Intuition');
  const [newThreadCode, setNewThreadCode] = useState('');
  const [newThreadCodeLang, setNewThreadCodeLang] = useState('python');
  const [newThreadPreview, setNewThreadPreview] = useState(false);

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

  // Auth gate helper for actions
  const requireAuthAction = (action: () => void) => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      else showToast('Please sign in to participate in the discussions.');
      return;
    }
    action();
  };

  // Fetch paginated threads for current view
  const threadQueryResult = useMemo(() => {
    const catId = viewMode === 'category-threads' ? selectedCategoryId : (selectedCategoryId === 'all' ? undefined : selectedCategoryId);
    const effectiveFilter = viewMode === 'category-threads' ? (categoryFilter as ThreadFilter) : activeFilter;
    return ForumService.getThreads(
      catId,
      effectiveFilter,
      searchQuery,
      currentUser?.id,
      currentPage,
      20
    );
  }, [viewMode, selectedCategoryId, activeFilter, categoryFilter, searchQuery, currentUser?.id, currentPage]);

  const threads = threadQueryResult.threads;
  const totalPages = threadQueryResult.totalPages;

  // Active thread details
  const activeThread = useMemo(() => {
    if (!selectedThreadId) return null;
    return ForumService.getThreadByIdOrSlug(selectedThreadId, currentUser?.id, true);
  }, [selectedThreadId, currentUser?.id]);

  // Active category details
  const activeCategory = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 'all') return null;
    return ForumService.getCategoryByIdOrSlug(selectedCategoryId);
  }, [selectedCategoryId, categories]);

  // Handle initial discussion / category selection or URL change
  useEffect(() => {
    if (initialDiscussionId) {
      setSelectedThreadId(initialDiscussionId);
      setViewMode('thread-detail');
      setPostsPage(1);
    } else if (initialCategorySlug) {
      const cat = ForumService.getCategoryByIdOrSlug(initialCategorySlug);
      setSelectedCategoryId(cat ? cat.id : initialCategorySlug);
      setViewMode('category-threads');
      setSelectedThreadId(null);
      setCurrentPage(1);
    } else {
      setSelectedThreadId(null);
      setSelectedCategoryId('all');
      setViewMode('categories');
    }
  }, [initialDiscussionId, initialCategorySlug]);

  // Load draft when opening new thread modal
  useEffect(() => {
    if (isCreatingThread && currentUser) {
      const draft = ForumService.getDraft(currentUser.id);
      if (draft) {
        setNewThreadTitle(draft.title || '');
        setNewThreadCategory(draft.categoryId || 'cat-dsa');
        setNewThreadContent(draft.content || '');
        setNewThreadTags(draft.tags || 'DSA, Intuition');
        if (draft.codeSnippet) {
          setNewThreadCode(draft.codeSnippet.code || '');
          setNewThreadCodeLang(draft.codeSnippet.language || 'python');
        }
      }
    }
  }, [isCreatingThread, currentUser]);

  // Auto-save draft on change
  useEffect(() => {
    if (isCreatingThread && currentUser && (newThreadTitle || newThreadContent)) {
      ForumService.saveDraft(currentUser.id, {
        title: newThreadTitle,
        categoryId: newThreadCategory,
        content: newThreadContent,
        tags: newThreadTags,
        codeSnippet: newThreadCode ? { language: newThreadCodeLang, code: newThreadCode } : undefined
      });
    }
  }, [newThreadTitle, newThreadCategory, newThreadContent, newThreadTags, newThreadCode, newThreadCodeLang, isCreatingThread, currentUser]);

  const refreshData = () => {
    setSections(ForumService.getSections());
    setCategories(ForumService.getCategories());
  };


  // Reactions toggle handler
  const handleToggleReaction = (postId: string, reactionType: ForumReactionType) => {
    requireAuthAction(() => {
      if (!selectedThreadId || !currentUser) return;
      ForumService.toggleReaction(selectedThreadId, postId, reactionType, currentUser.id);
      refreshData();
    });
  };

  // Watch & Bookmark handlers
  const handleToggleWatch = () => {
    requireAuthAction(() => {
      if (!selectedThreadId || !currentUser) return;
      const isWatching = ForumService.toggleWatchThread(selectedThreadId, currentUser.id);
      refreshData();
      showToast(isWatching ? 'Thread added to your watch list.' : 'Thread removed from your watch list.');
    });
  };

  const handleToggleBookmark = () => {
    requireAuthAction(() => {
      if (!selectedThreadId || !currentUser) return;
      const isBookmarked = ForumService.toggleBookmarkThread(selectedThreadId, currentUser.id);
      refreshData();
      showToast(isBookmarked ? 'Discussion saved to your bookmarks.' : 'Discussion removed from your bookmarks.');
    });
  };

  // Accepted Answer handler (Author or Moderator only)
  const handleToggleAcceptedAnswer = (postId: string) => {
    requireAuthAction(() => {
      if (!selectedThreadId || !currentUser) return;
      const res = ForumService.markAcceptedAnswer(selectedThreadId, postId, currentUser.id, currentUser.role);
      if (!res.success) {
        showToast(res.error || 'Action not permitted.');
        return;
      }
      refreshData();
      showToast(res.isSolved ? 'Marked reply as accepted answer! Thread solved.' : 'Removed accepted answer mark.');
    });
  };

  // Moderation action handler
  const handleModeratorAction = (action: 'lock' | 'unlock' | 'pin' | 'unpin' | 'delete' | 'mark_solved' | 'unmark_solved') => {
    requireAuthAction(() => {
      if (!selectedThreadId || !currentUser) return;
      const res = ForumService.moderationAction(selectedThreadId, action, currentUser.id, currentUser.role);
      setIsModeratorMenuOpen(false);
      if (!res.success) {
        showToast(res.error || 'Action failed.');
        return;
      }
      if (action === 'delete') {
        showToast('Discussion deleted.');
        navigate('/discussions');
      } else {
        showToast(`Discussion ${action}ed successfully.`);
      }
      refreshData();
    });
  };

  // Share handler
  const handleShare = () => {
    const slug = activeThread?.slug || activeThread?.id;
    const url = slug
      ? `${window.location.origin}/discussions/${slug}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Discussion link copied to clipboard!');
  };

  // Quote post into reply editor
  const handleQuotePost = (postNumber: number, authorUsername: string, content: string) => {
    requireAuthAction(() => {
      const cleanQuote = content.replace(/^>\s*/gm, '').trim().slice(0, 300);
      const quoteText = `> @${authorUsername} wrote (#${postNumber}):\n> ${cleanQuote.replace(/\n/g, '\n> ')}\n\n`;
      setReplyContent(prev => prev ? `${prev}\n\n${quoteText}` : quoteText);
      setReplyToPostNumber(postNumber);
      setReplyToAuthor(authorUsername);
      replyTextareaRef.current?.focus();
      replyTextareaRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  // Rich text editor toolbar insertion
  const handleInsertFormatting = (type: 'bold' | 'italic' | 'code-inline' | 'code-block' | 'quote' | 'list' | 'link') => {
    const textarea = replyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = replyContent.substring(start, end);
    let replacement = '';

    switch (type) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'italic text'}*`;
        break;
      case 'code-inline':
        replacement = `\`${selected || 'code'}\``;
        break;
      case 'code-block':
        replacement = `\n\`\`\`python\n${selected || '# Write code here\ndef solution():\n    pass'}\n\`\`\`\n`;
        break;
      case 'quote':
        replacement = `\n> ${selected || 'Quoted text'}\n`;
        break;
      case 'list':
        replacement = `\n- ${selected || 'List item'}\n`;
        break;
      case 'link':
        replacement = `[${selected || 'Link title'}](https://example.com)`;
        break;
    }

    const nextContent = replyContent.substring(0, start) + replacement + replyContent.substring(end);
    setReplyContent(nextContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // Submit reply handler
  const handlePostReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuthAction(() => {
      if (!replyContent.trim() || !selectedThreadId || !currentUser) return;

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

      const res = ForumService.addReply(selectedThreadId, replyContent, author, replyToPostNumber, replyToAuthor);
      if (!res.success) {
        showToast(res.error || 'Failed to post reply.');
        return;
      }

      setReplyContent('');
      setReplyToPostNumber(undefined);
      setReplyToAuthor(undefined);
      refreshData();
      showToast('Your reply was posted successfully!');
    });
  };

  // Submit new thread handler
  const handleCreateThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuthAction(() => {
      if (!newThreadTitle.trim() || !newThreadContent.trim() || !currentUser) return;

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

      let finalContent = newThreadContent.trim();
      if (newThreadCode.trim()) {
        finalContent += `\n\n\`\`\`${newThreadCodeLang}\n${newThreadCode.trim()}\n\`\`\``;
      }

      const res = ForumService.createThread({
        title: newThreadTitle.trim(),
        content: finalContent,
        categoryId: newThreadCategory,
        tags: newThreadTags.split(',').map(t => t.trim()).filter(Boolean),
        author
      });

      if (!res.success || !res.thread) {
        showToast(res.error || 'Failed to create discussion.');
        return;
      }

      ForumService.clearDraft(currentUser.id);
      setIsCreatingThread(false);
      setNewThreadTitle('');
      setNewThreadContent('');
      setNewThreadCode('');
      const targetSlug = res.thread.slug || res.thread.id;
      setSelectedThreadId(targetSlug);
      setViewMode('thread-detail');
      navigate(`/discussions/${targetSlug}`);
      refreshData();
      showToast('Discussion thread created successfully!');
    });
  };

  // Submit report handler
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPost) return;
    ForumService.reportContent(reportingPost.id, reportReason, currentUser?.id);
    setReportingPost(null);
    showToast('Report submitted. Our moderation team has been notified.');
  };

  // Safe Tokenized Syntax Highlighting Renderer
  const renderHighlightedCode = (code: string, lang: string, blockKey: string) => {
    const tokens = SecuritySanitizer.tokenizeCode(code, lang);

    return (
      <div className="my-3 overflow-hidden rounded-xl border border-white/10 bg-[#07070b] font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[11px] text-white/50">
          <span className="font-semibold text-amber-400/90 uppercase tracking-wider">{lang || 'code'}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopiedPostId(blockKey);
              setTimeout(() => setCopiedPostId(null), 2000);
            }}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            {copiedPostId === blockKey ? (
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
        <pre className="overflow-x-auto p-4 text-white/90 leading-relaxed font-mono">
          <code>
            {tokens.map((tok: CodeToken, tIdx: number) => {
              let colorClass = 'text-white/90';
              if (tok.type === 'keyword') colorClass = 'text-amber-400 font-semibold';
              else if (tok.type === 'string') colorClass = 'text-emerald-400';
              else if (tok.type === 'number') colorClass = 'text-cyan-400';
              else if (tok.type === 'comment') colorClass = 'text-white/40 italic';
              else if (tok.type === 'function') colorClass = 'text-blue-400';
              else if (tok.type === 'operator') colorClass = 'text-purple-300';

              return (
                <span key={tIdx} className={colorClass}>
                  {tok.text}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    );
  };

  // Safe Rich Text Formatter (100% escaped, zero dangerous HTML injection)
  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const safeContent = SecuritySanitizer.limitQuoteNesting(content);
    const parts = safeContent.split(/(```[\s\S]*?```)/g);

    return (
      <div className="space-y-3 leading-relaxed text-sm text-white/85">
        {parts.map((part, idx) => {
          if (part.startsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const lang = lines[0].trim().toLowerCase();
            const code = lines.length > 1 ? lines.slice(1).join('\n') : lines[0];
            return (
              <React.Fragment key={idx}>
                {renderHighlightedCode(code, lang, `code-block-${idx}`)}
              </React.Fragment>
            );
          }

          // Handle blockquotes
          if (part.startsWith('>')) {
            const quoteLines = part.replace(/^>\s*/gm, '').trim();
            return (
              <blockquote key={idx} className="border-l-2 border-amber-400/50 bg-amber-400/[0.04] pl-3.5 py-1 text-xs text-white/70 italic rounded-r-lg">
                {quoteLines}
              </blockquote>
            );
          }

          // Regular paragraphs: parse inline code, bold, italic, and safe links
          const paragraphs = part.split('\n\n').filter(p => p.trim().length > 0);
          return (
            <React.Fragment key={idx}>
              {paragraphs.map((para, pIdx) => {
                const inlineParts = para.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

                return (
                  <p key={pIdx} className="leading-relaxed">
                    {inlineParts.map((sub, sIdx) => {
                      if (sub.startsWith('`') && sub.endsWith('`')) {
                        return (
                          <code key={sIdx} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-amber-300">
                            {sub.slice(1, -1)}
                          </code>
                        );
                      }
                      if (sub.startsWith('**') && sub.endsWith('**')) {
                        return (
                          <strong key={sIdx} className="font-bold text-white">
                            {sub.slice(2, -2)}
                          </strong>
                        );
                      }
                      if (sub.startsWith('*') && sub.endsWith('*')) {
                        return (
                          <em key={sIdx} className="italic text-white/90">
                            {sub.slice(1, -1)}
                          </em>
                        );
                      }
                      if (sub.startsWith('[') && sub.includes('](') && sub.endsWith(')')) {
                        const titleMatch = sub.match(/\[(.*?)\]/);
                        const urlMatch = sub.match(/\((.*?)\)/);
                        const linkTitle = titleMatch ? titleMatch[1] : 'link';
                        const linkUrl = urlMatch ? urlMatch[1] : '#';

                        if (SecuritySanitizer.isSafeUrl(linkUrl)) {
                          return (
                            <a
                              key={sIdx}
                              href={linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 underline hover:text-amber-300 transition-colors"
                            >
                              {linkTitle}
                            </a>
                          );
                        }
                        return <span key={sIdx}>{linkTitle}</span>;
                      }

                      return <span key={sIdx}>{sub}</span>;
                    })}
                  </p>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Paginated thread comments (20 per page)
  const paginatedComments = useMemo(() => {
    if (!activeThread?.comments) return [];
    const startIndex = (postsPage - 1) * 20;
    return activeThread.comments.slice(startIndex, startIndex + 20);
  }, [activeThread?.comments, postsPage]);

  const totalPostPages = useMemo(() => {
    if (!activeThread?.comments) return 1;
    return Math.max(1, Math.ceil(activeThread.comments.length / 20));
  }, [activeThread?.comments]);

  const isUserModerator = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  return (
    <div className="min-h-screen bg-[#07070b] text-white/90 pb-20 pt-4 px-3 sm:px-6 lg:px-8">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-[#12121c]/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-md animate-in fade-in duration-200">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ========================================================================= */}
        {/* TOP FORUM NAVIGATION (COMPACT, PROFESSIONAL)                              */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12]/90 p-4 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title & Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 shadow-inner">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  DISCUSSIONS
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Community Forum
                  </span>
                </h1>
                <p className="text-xs text-white/50">Ask questions, share solutions, and learn with the CodeSpark community</p>
              </div>
            </div>

            {/* Right: Search & New Discussion */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (viewMode === 'categories') setViewMode('all-threads');
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => requireAuthAction(() => setIsCreatingThread(true))}
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-semibold text-black hover:bg-amber-300 transition-all shadow-md shadow-amber-400/10 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>New Discussion</span>
              </button>
            </div>
          </div>

          {/* Nav Tabs Bar */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto border-t border-white/[0.06] pt-3 scrollbar-none text-xs">
            <button
              onClick={() => { setViewMode('categories'); setSelectedCategoryId('all'); }}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                viewMode === 'categories'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Categories
            </button>

            <button
              onClick={() => { setViewMode('all-threads'); setActiveFilter('all'); setSelectedCategoryId('all'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                viewMode === 'all-threads' && activeFilter === 'all'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              All Discussions
            </button>

            <button
              onClick={() => { setViewMode('all-threads'); setActiveFilter('latest'); setSelectedCategoryId('all'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                viewMode === 'all-threads' && activeFilter === 'latest'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Latest
            </button>

            <button
              onClick={() => { setViewMode('all-threads'); setActiveFilter('popular'); setSelectedCategoryId('all'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                viewMode === 'all-threads' && activeFilter === 'popular'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Popular
            </button>

            <button
              onClick={() => { setViewMode('all-threads'); setActiveFilter('unanswered'); setSelectedCategoryId('all'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                viewMode === 'all-threads' && activeFilter === 'unanswered'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Unanswered
            </button>

            <button
              onClick={() => { setViewMode('all-threads'); setActiveFilter('solved'); setSelectedCategoryId('all'); setCurrentPage(1); }}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                viewMode === 'all-threads' && activeFilter === 'solved'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Solved
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => { setViewMode('all-threads'); setActiveFilter('saved'); setSelectedCategoryId('all'); setCurrentPage(1); }}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                    viewMode === 'all-threads' && activeFilter === 'saved'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  Saved
                </button>

                <button
                  onClick={() => { setViewMode('all-threads'); setActiveFilter('my-discussions'); setSelectedCategoryId('all'); setCurrentPage(1); }}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                    viewMode === 'all-threads' && activeFilter === 'my-discussions'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  My Discussions
                </button>
              </>
            )}
          </div>
        </div>

        {/* TOP FORUM ENTRY: Discussion Rules (Clickable top forum row with link icon) */}
        {viewMode !== 'thread-detail' && (
          <Link
            href="/discussions/rules"
            className="group mb-6 flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0c0c12] px-4 py-3 sm:py-3.5 hover:border-amber-400/40 hover:bg-white/[0.02] transition-all cursor-pointer shadow-md active:scale-[0.99] block no-underline"
            aria-label="Discussion Rules"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 group-hover:scale-105 transition-all">
                <LinkIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                    Discussion Rules
                  </h3>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/[0.06] text-white/50 border border-white/10 hidden sm:inline-block">
                    Official
                  </span>
                </div>
                <p className="text-[11px] text-white/40 truncate">
                  CodeSpark community guidelines and forum conduct standards
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 text-white/40 group-hover:text-amber-400 transition-colors ml-2">
              <LinkIcon className="h-3.5 w-3.5" />
              <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: FORUM CATEGORIES LIST (4 HIERARCHICAL SECTIONS)                    */}
        {/* ========================================================================= */}
        {viewMode === 'categories' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Render 4 Hierarchical Sections */}
            {sections.map(section => (
              <div key={section.id} className="space-y-3">
                
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {section.title}
                    </h3>
                  </div>
                  <span className="text-xs text-white/40">{section.description}</span>
                </div>

                {/* Categories Grid for Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {section.categories.map(cat => {
                    const IconComponent = CATEGORY_ICON_MAP[cat.iconName] || MessageSquare;

                    return (
                      <Link
                        key={cat.id}
                        href={`/discussions/category/${cat.slug || cat.id}`}
                        className="group relative rounded-xl border border-white/[0.06] bg-[#0c0c12] p-4.5 hover:border-amber-400/40 hover:bg-white/[0.02] transition-all cursor-pointer shadow-lg hover:shadow-amber-400/5 block no-underline"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-amber-400 group-hover:scale-105 group-hover:bg-amber-400/10 transition-all">
                            <IconComponent className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                                {cat.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-white/40 shrink-0">
                                <span>{cat.threadCount} threads</span>
                                <span>·</span>
                                <span>{cat.postCount} posts</span>
                              </div>
                            </div>

                            <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>

                            {/* Latest Thread Snippet */}
                            {cat.latestThread && (
                              <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[11px] text-white/40">
                                <span className="truncate pr-2 hover:text-white/70">
                                  ↳ {cat.latestThread.title}
                                </span>
                                <span className="shrink-0 text-white/30">
                                  {cat.latestThread.lastActivity}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CATEGORY THREADS OR ALL THREADS LIST (COMPACT FORUM ROWS)         */}
        {/* ========================================================================= */}
        {viewMode === 'category-threads' && !activeCategory && (
          <NotFoundView type="category" identifier={initialCategorySlug || selectedCategoryId} />
        )}

        {(viewMode === 'all-threads' || (viewMode === 'category-threads' && activeCategory)) && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Link 
                href="/"
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link 
                href="/discussions"
                className="hover:text-white transition-colors"
              >
                Discussions
              </Link>
              {viewMode === 'category-threads' && activeCategory && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-amber-400 font-medium">{activeCategory.name}</span>
                </>
              )}
            </div>

            {/* Category Banner / Header if inside a category */}
            {viewMode === 'category-threads' && activeCategory && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {activeCategory.name}
                  </h2>
                  <p className="text-xs text-white/50 mt-1">{activeCategory.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Category filter pills */}
                  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 text-xs">
                    {(['latest', 'popular', 'unanswered', 'solved'] as CategoryFilter[]).map(f => (
                      <button
                        key={f}
                        onClick={() => { setCategoryFilter(f); setCurrentPage(1); }}
                        className={`rounded-lg px-2.5 py-1 capitalize transition-colors ${
                          categoryFilter === f ? 'bg-amber-400 text-black font-semibold' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => requireAuthAction(() => setIsCreatingThread(true))}
                    className="flex items-center gap-1 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-300 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Thread</span>
                  </button>
                </div>
              </div>
            )}

            {/* Forum Thread Rows Table Header */}
            <div className="rounded-t-xl border border-b-0 border-white/[0.08] bg-[#0c0c12] px-4 py-2.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/40">
              <span>Thread Title & Topic</span>
              <div className="flex items-center gap-8 pr-4">
                <span className="hidden sm:inline">Stats</span>
                <span>Last Activity</span>
              </div>
            </div>

            {/* Forum Thread Rows */}
            <div className="divide-y divide-white/[0.06] rounded-b-xl border border-white/[0.08] bg-[#0a0a0f] overflow-hidden">
              {threads.length === 0 ? (
                <div className="py-16 text-center text-white/40 space-y-3">
                  <MessageSquare className="mx-auto h-10 w-10 stroke-1 text-white/20" />
                  <p className="text-sm">No discussions found matching your current filter.</p>
                  <button
                    onClick={() => requireAuthAction(() => setIsCreatingThread(true))}
                    className="mt-2 text-xs text-amber-400 hover:underline"
                  >
                    Be the first person to start this conversation →
                  </button>
                </div>
              ) : (
                threads.map(thread => (
                  <Link
                    key={thread.id}
                    href={`/discussions/${thread.slug || thread.id}`}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer gap-3 block no-underline ${
                      thread.isPinned ? 'bg-amber-500/[0.02]' : ''
                    }`}
                  >
                    {/* Left: Status Icon, Title, Author & Tags */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="mt-0.5 shrink-0">
                        {thread.isPinned ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400" title="Pinned Thread">
                            <Pin className="h-3.5 w-3.5" />
                          </div>
                        ) : thread.isLocked ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400" title="Locked Thread">
                            <Lock className="h-3.5 w-3.5" />
                          </div>
                        ) : thread.isSolved ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" title="Solved Thread">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 group-hover:text-amber-400 transition-colors">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-sm text-white group-hover:text-amber-400 transition-colors leading-snug">
                            {thread.title}
                          </h4>
                          {thread.isSolved && (
                            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 text-[10px] font-semibold text-emerald-400">
                              ✓ Solved
                            </span>
                          )}
                          {thread.isPinned && (
                            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.2 text-[10px] font-semibold text-amber-400">
                              Pinned
                            </span>
                          )}
                        </div>

                        {/* Author & Problem link & Tags */}
                        <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-white/40">
                          <span className="text-white/70 font-medium">@{thread.author.username}</span>
                          <span>·</span>
                          <span>in {thread.categoryName}</span>
                          
                          {thread.problemTitle && (
                            <>
                              <span>·</span>
                              <span 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (thread.problemId && onNavigateProblem) {
                                    onNavigateProblem(thread.problemId);
                                  }
                                }}
                                className="text-amber-400/80 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                Problem: {thread.problemTitle}
                              </span>
                            </>
                          )}

                          {thread.tags?.map(t => (
                            <span key={t} className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/60">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Reply Count, Views, Last Activity */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                      <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-0.5 text-xs text-white/50">
                        <span className="font-semibold text-white">{(thread.comments?.length || 0)} replies</span>
                        <span className="text-[11px] text-white/40">{thread.views || 1} views</span>
                      </div>

                      <div className="text-xs text-white/40 text-right">
                        <span className="block text-white/60">{thread.lastActivityAt || thread.createdAt}</span>
                        <span className="text-[10px] text-white/30 truncate max-w-[100px]">
                          {thread.comments && thread.comments.length > 0 
                            ? `by @${thread.comments[thread.comments.length - 1].author.username}`
                            : `by @${thread.author.username}`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Pagination Controls (20 per page) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs">
                <span className="text-white/40">
                  Page {currentPage} of {totalPages} ({threadQueryResult.totalCount} discussions)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold ${
                        currentPage === p
                          ? 'bg-amber-400 text-black font-bold'
                          : 'text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: THREAD DETAIL PAGE (CLASSIC 2-COLUMN FORUM POST LAYOUT)           */}
        {/* ========================================================================= */}
        {viewMode === 'thread-detail' && !activeThread && (
          <NotFoundView type="discussion" identifier={selectedThreadId || initialDiscussionId || ''} />
        )}

        {viewMode === 'thread-detail' && activeThread && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Link 
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link 
                  href="/discussions"
                  className="hover:text-white transition-colors"
                >
                  Discussions
                </Link>
                {!activeThread.is_system_discussion && (
                  <>
                    <ChevronRight className="h-3 w-3" />
                    <Link 
                      href={activeCategory ? `/discussions/category/${activeCategory.slug || activeCategory.id}` : '/discussions'}
                      className="hover:text-white transition-colors truncate max-w-[120px]"
                    >
                      {activeThread.categoryName || activeCategory?.name || 'Category'}
                    </Link>
                  </>
                )}
                <ChevronRight className="h-3 w-3" />
                <span className="text-amber-400 font-medium truncate max-w-[200px]">
                  {activeThread.title}
                </span>
              </div>

              <Link
                href={activeThread.is_system_discussion ? '/discussions' : (activeCategory ? `/discussions/category/${activeCategory.slug || activeCategory.id}` : '/discussions')}
                className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{activeThread.is_system_discussion ? 'Back to discussions' : 'Back to threads'}</span>
              </Link>
            </div>

            {/* THREAD HEADER */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Title & metadata */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/80">
                      {activeThread.is_system_discussion ? 'Official Guidelines' : activeThread.categoryName}
                    </span>
                    {activeThread.isPinned && (
                      <span className="rounded-md bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                    {activeThread.isLocked && (
                      <span className="rounded-md bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-[11px] font-semibold text-red-400 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> {activeThread.is_system_discussion ? 'Read-only' : 'Locked'}
                      </span>
                    )}
                    {activeThread.isSolved && (
                      <span className="rounded-md bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Solved
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    {activeThread.title}
                  </h2>

                  <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                    <span>Started by <strong className="text-white/80">@{activeThread.author.username}</strong></span>
                    <span>·</span>
                    <span>{activeThread.createdAt}</span>
                    <span>·</span>
                    <span>{activeThread.views || 1} views</span>
                    {!activeThread.is_system_discussion && (
                      <>
                        <span>·</span>
                        <span>{(activeThread.comments?.length || 0) + 1} total posts</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Thread Controls */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  {!activeThread.is_system_discussion && (
                    <>
                      <button
                        onClick={handleToggleWatch}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          currentUser && activeThread.watchedByUserIds?.includes(currentUser.id)
                            ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                            : 'border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        {currentUser && activeThread.watchedByUserIds?.includes(currentUser.id) ? (
                          <>
                            <Bell className="h-3.5 w-3.5 fill-blue-400" />
                            <span>Watching</span>
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
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          currentUser && activeThread.bookmarkedByUserIds?.includes(currentUser.id)
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                            : 'border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        {currentUser && activeThread.bookmarkedByUserIds?.includes(currentUser.id) ? (
                          <>
                            <BookmarkCheck className="h-3.5 w-3.5 text-amber-400" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-3.5 w-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share</span>
                  </button>

                  {/* Moderator Controls Dropdown (for regular threads only) */}
                  {!activeThread.is_system_discussion && isUserModerator && (
                    <div className="relative">
                      <button
                        onClick={() => setIsModeratorMenuOpen(prev => !prev)}
                        className="flex items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-500/10 px-2.5 py-1.5 text-xs font-semibold text-purple-400 hover:bg-purple-500/20 transition-all cursor-pointer"
                        title="Moderator Tools"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Mod</span>
                      </button>

                      {isModeratorMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#12121c] p-1.5 shadow-2xl z-30 space-y-1 text-xs">
                          <button
                            onClick={() => handleModeratorAction(activeThread.isLocked ? 'unlock' : 'lock')}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-white/80"
                          >
                            {activeThread.isLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                            <span>{activeThread.isLocked ? 'Unlock Thread' : 'Lock Thread'}</span>
                          </button>
                          <button
                            onClick={() => handleModeratorAction(activeThread.isPinned ? 'unpin' : 'pin')}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-white/80"
                          >
                            <Pin className="h-3.5 w-3.5" />
                            <span>{activeThread.isPinned ? 'Unpin Thread' : 'Pin Thread'}</span>
                          </button>
                          <button
                            onClick={() => handleModeratorAction(activeThread.isSolved ? 'unmark_solved' : 'mark_solved')}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-white/80"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{activeThread.isSolved ? 'Unmark Solved' : 'Mark Solved'}</span>
                          </button>
                          <div className="border-t border-white/[0.06] my-1" />
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to permanently delete this discussion?')) {
                                handleModeratorAction('delete');
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Thread</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Locked Thread Warning Banner */}
              {activeThread.isLocked && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-center gap-2.5">
                  <Lock className="h-4 w-4 text-red-400 shrink-0" />
                  <span>This discussion is locked and no further replies can be added.</span>
                </div>
              )}
            </div>

            {/* ===================================================================== */}
            {/* POSTS LIST: 2-COLUMN CLASSIC FORUM POST LAYOUT                       */}
            {/* ===================================================================== */}
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
                          className="font-bold text-sm text-white hover:text-amber-400 transition-colors text-left cursor-pointer"
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

                    {/* Author Statistics (From Authenticated User Data) */}
                    <div className="hidden md:flex flex-col gap-1.5 border-t border-white/[0.06] pt-3 mt-1 text-[11px] text-white/50 w-full">
                      <div className="flex justify-between">
                        <span>Joined:</span>
                        <span className="text-white/70 font-medium">{activeThread.author.joinedDate || 'Apr 2026'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Posts:</span>
                        <span className="text-white/70 font-medium">{activeThread.author.postCount || 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>XP:</span>
                        <span className="text-amber-400 font-semibold">{activeThread.author.xp?.toLocaleString() || 100}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Solved:</span>
                        <span className="text-emerald-400 font-semibold">{activeThread.author.problemsSolved || 0}</span>
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
                      {activeThread.content && activeThread.content.trim().length > 0 ? (
                        renderFormattedContent(activeThread.content)
                      ) : activeThread.is_system_discussion ? (
                        <div className="py-10 px-6 text-center rounded-xl border border-white/[0.06] bg-white/[0.02] my-2">
                          <p className="text-sm sm:text-base text-white/80 font-medium">Discussion rules have not been published yet.</p>
                        </div>
                      ) : (
                        renderFormattedContent(activeThread.content)
                      )}
                    </div>

                    {/* Post Bottom Actions & Reactions */}
                    <div className="mt-6 border-t border-white/[0.06] pt-4 flex flex-wrap items-center justify-between gap-3">
                      {activeThread.is_system_discussion ? (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Shield className="h-3.5 w-3.5 text-amber-400/80" />
                          <span>Official Platform Guidelines</span>
                        </div>
                      ) : (
                        /* Reactions Bar */
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(['like', 'love', 'helpful', 'great'] as ForumReactionType[]).map(type => {
                            const count = activeThread.reactions?.[type]?.length || 0;
                            const hasReacted = currentUser && activeThread.reactions?.[type]?.includes(currentUser.id);
                            const emoji = type === 'like' ? '👍' : type === 'love' ? '❤️' : type === 'helpful' ? '💡' : '🔥';
                            const label = type === 'like' ? 'Like' : type === 'love' ? 'Love' : type === 'helpful' ? 'Helpful' : 'Great';

                            return (
                              <button
                                key={type}
                                onClick={() => handleToggleReaction(activeThread.id, type)}
                                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all cursor-pointer ${
                                  hasReacted
                                    ? 'border-amber-400/50 bg-amber-400/15 text-amber-300 font-semibold'
                                    : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06]'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span>{label}</span>
                                {count > 0 && <span className="text-[11px] opacity-80">({count})</span>}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Post Action Buttons */}
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        {!activeThread.is_system_discussion && !activeThread.isLocked && (
                          <button
                            onClick={() => handleQuotePost(1, activeThread.author.username, activeThread.content)}
                            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Quote className="h-3.5 w-3.5" />
                            <span>Quote</span>
                          </button>
                        )}
                        <button
                          onClick={handleShare}
                          className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Share</span>
                        </button>
                        {!activeThread.is_system_discussion && (
                          <button
                            onClick={() => setReportingPost({ id: activeThread.id, type: 'thread' })}
                            className="hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Report</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. REPLIES (#2, #3...) */}
              {!activeThread.is_system_discussion && paginatedComments.map(comment => {
                const isAccepted = comment.isAcceptedAnswer || activeThread.acceptedPostId === comment.id;
                const canAccept = currentUser && (currentUser.id === activeThread.author.id || isUserModerator);

                return (
                  <div
                    key={comment.id}
                    id={`post-${comment.postNumber}`}
                    className={`rounded-2xl border bg-[#0c0c12] overflow-hidden shadow-xl transition-all ${
                      isAccepted
                        ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-500/[0.03] to-transparent ring-1 ring-emerald-500/20'
                        : 'border-white/[0.08]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row">
                      
                      {/* Left: User Profile Column */}
                      <div className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#08080d] p-4 sm:p-5 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4">
                        <div className="flex md:flex-col items-center md:items-start gap-3">
                          <div className="relative">
                            <img
                              src={comment.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={comment.author.name}
                              className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10"
                            />
                            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#08080d] bg-emerald-500" />
                          </div>
                          <div>
                            <button
                              onClick={() => onNavigateProfile && onNavigateProfile(comment.author.id)}
                              className="font-bold text-sm text-white hover:text-amber-400 transition-colors text-left cursor-pointer"
                            >
                              {comment.author.name}
                            </button>
                            <div className="text-[11px] text-white/40">@{comment.author.username}</div>

                            <span className={`inline-block mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
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

                        {/* Stats */}
                        <div className="hidden md:flex flex-col gap-1.5 border-t border-white/[0.06] pt-3 mt-1 text-[11px] text-white/50 w-full">
                          <div className="flex justify-between">
                            <span>Joined:</span>
                            <span className="text-white/70 font-medium">{comment.author.joinedDate || 'Apr 2026'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Posts:</span>
                            <span className="text-white/70 font-medium">{comment.author.postCount || 2}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>XP:</span>
                            <span className="text-amber-400 font-semibold">{comment.author.xp?.toLocaleString() || 100}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Solved:</span>
                            <span className="text-emerald-400 font-semibold">{comment.author.problemsSolved || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Post Content & Actions */}
                      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                        <div>
                          {/* Top Header */}
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs text-white/40 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-white/30" />
                                <span>{comment.createdAt}</span>
                              </div>
                              {comment.replyToPostNumber && (
                                <span className="text-white/30">
                                  In reply to <a href={`#post-${comment.replyToPostNumber}`} className="text-amber-400/70 hover:underline">#{comment.replyToPostNumber}</a>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {isAccepted && (
                                <div className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>✓ Accepted Answer</span>
                                </div>
                              )}
                              <a href={`#post-${comment.postNumber}`} className="font-mono text-amber-400/80 hover:text-amber-300 font-semibold">
                                #{comment.postNumber}
                              </a>
                            </div>
                          </div>

                          {/* Content */}
                          {renderFormattedContent(comment.content)}
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-6 border-t border-white/[0.06] pt-4 flex flex-wrap items-center justify-between gap-3">
                          {/* Reactions Bar */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(['like', 'love', 'helpful', 'great'] as ForumReactionType[]).map(type => {
                              const count = comment.reactions?.[type]?.length || 0;
                              const hasReacted = currentUser && comment.reactions?.[type]?.includes(currentUser.id);
                              const emoji = type === 'like' ? '👍' : type === 'love' ? '❤️' : type === 'helpful' ? '💡' : '🔥';
                              const label = type === 'like' ? 'Like' : type === 'love' ? 'Love' : type === 'helpful' ? 'Helpful' : 'Great';

                              return (
                                <button
                                  key={type}
                                  onClick={() => handleToggleReaction(comment.id, type)}
                                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all cursor-pointer ${
                                    hasReacted
                                      ? 'border-amber-400/50 bg-amber-400/15 text-amber-300 font-semibold'
                                      : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06]'
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  <span>{label}</span>
                                  {count > 0 && <span className="text-[11px] opacity-80">({count})</span>}
                                </button>
                              );
                            })}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            {canAccept && (
                              <button
                                onClick={() => handleToggleAcceptedAnswer(comment.id)}
                                className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                                  isAccepted ? 'text-emerald-400 hover:text-emerald-300' : 'text-white/60 hover:text-emerald-400'
                                }`}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>{isAccepted ? 'Unmark Accepted' : 'Mark as Accepted Answer'}</span>
                              </button>
                            )}

                            {!activeThread.isLocked && (
                              <button
                                onClick={() => handleQuotePost(comment.postNumber || 2, comment.author.username, comment.content)}
                                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Quote className="h-3.5 w-3.5" />
                                <span>Quote</span>
                              </button>
                            )}

                            <button
                              onClick={() => setReportingPost({ id: comment.id, type: 'post' })}
                              className="hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                              <span>Report</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Posts Pagination (20 posts per page) */}
            {!activeThread.is_system_discussion && totalPostPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs">
                <span className="text-white/40">
                  Posts Page {postsPage} of {totalPostPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={postsPage === 1}
                    onClick={() => setPostsPage(p => Math.max(1, p - 1))}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>
                  {Array.from({ length: totalPostPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPostsPage(p)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold ${
                        postsPage === p ? 'bg-amber-400 text-black font-bold' : 'text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={postsPage === totalPostPages}
                    onClick={() => setPostsPage(p => Math.min(totalPostPages, p + 1))}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* REPLY BOX & RICH TEXT EDITOR                                          */}
            {/* ===================================================================== */}
            {!activeThread.is_system_discussion && (
              activeThread.isLocked ? (
                <div className="rounded-2xl border border-red-500/20 bg-[#0c0c12] p-6 text-center text-xs text-red-300">
                  <Lock className="mx-auto h-6 w-6 text-red-400 mb-2" />
                  <p className="font-semibold">This discussion has been locked by a moderator.</p>
                  <p className="text-white/40 mt-1">No further replies or contributions can be posted.</p>
                </div>
              ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-amber-400" />
                    <span>Post a Reply</span>
                  </h3>

                  {replyToAuthor && (
                    <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                      <span>Replying to @{replyToAuthor}</span>
                      <button 
                        onClick={() => { setReplyToAuthor(undefined); setReplyToPostNumber(undefined); }}
                        className="text-amber-400/70 hover:text-white cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handlePostReplySubmit} className="space-y-4">
                  
                  {/* Rich Text Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border border-b-0 border-white/10 bg-white/[0.03] p-2 text-xs">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting('bold')}
                        className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                        title="Bold"
                      >
                        <Bold className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting('italic')}
                        className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                        title="Italic"
                      >
                        <Italic className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting('code-inline')}
                        className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white font-mono"
                        title="Inline Code"
                      >
                        Code
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting('code-block')}
                        className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                        title="Code Block"
                      >
                        <Code className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting('quote')}
                        className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                        title="Quote"
                      >
                        <Quote className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting('list')}
                        className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                        title="List"
                      >
                        <List className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting('link')}
                        className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                        title="Link"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPreview(prev => !prev)}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                        showPreview ? 'bg-amber-400 text-black font-semibold' : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {showPreview ? 'Edit' : 'Preview'}
                    </button>
                  </div>

                  {/* Textarea or Preview */}
                  {showPreview ? (
                    <div className="min-h-[140px] rounded-b-xl border border-white/10 bg-[#07070b] p-4 text-sm text-white/90">
                      {replyContent.trim() ? (
                        renderFormattedContent(replyContent)
                      ) : (
                        <span className="text-white/30 italic text-xs">Nothing to preview yet.</span>
                      )}
                    </div>
                  ) : (
                    <textarea
                      ref={replyTextareaRef}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your response... (Markdown, code blocks, and lists supported)"
                      rows={5}
                      className="w-full rounded-b-xl border border-white/10 bg-[#07070b] p-4 text-sm text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all font-sans leading-relaxed"
                    />
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-white/40">
                      Keep discussions respectful, construct answers with clarity, and format code blocks.
                    </span>

                    <div className="flex items-center gap-2">
                      {replyContent && (
                        <button
                          type="button"
                          onClick={() => setReplyContent('')}
                          className="rounded-xl px-3.5 py-2 text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!replyContent.trim()}
                        className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-400/10 cursor-pointer"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CREATE NEW DISCUSSION                                              */}
        {/* ========================================================================= */}
        {isCreatingThread && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div 
              className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <Plus className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Create New Discussion</h3>
                </div>
                <button 
                  onClick={() => setIsCreatingThread(false)}
                  className="rounded-lg p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateThreadSubmit} className="space-y-4 text-xs">
                
                {/* Category Selector */}
                <div>
                  <label className="block font-semibold text-white/70 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newThreadCategory}
                    onChange={(e) => setNewThreadCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-white focus:border-amber-400/50 focus:outline-none transition-all cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#12121c] text-white">
                        {c.name} ({c.sectionId.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-semibold text-white/70 mb-1.5">
                    Discussion Title <span className="text-red-400">* (min 5 chars)</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={5}
                    placeholder="e.g., How should I approach sliding window problems?"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none transition-all"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-semibold text-white/70 mb-1.5">
                    Tags <span className="text-white/40">(Comma separated, max 5)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="DSA, Python, Intuition"
                    value={newThreadTags}
                    onChange={(e) => setNewThreadTags(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none transition-all"
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-semibold text-white/70">
                      Discussion Content <span className="text-red-400">* (min 20 chars)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {FeatureFlagService.getFlag('SPARK_AI') && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!newThreadContent.trim()) {
                              showToast('Type a draft of your question first.');
                              return;
                            }
                            const refined = `### Context & Overview\n${newThreadContent.trim()}\n\n### What I Tried\n- Analyzed the constraints and sample cases\n- Evaluated time/space bounds\n\n### Where I Am Seeking Help\nLooking for intuition on the core invariant.`;
                            setNewThreadContent(refined);
                            showToast('Spark structured your question into clean sections.');
                          }}
                          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-semibold text-[11px]"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Refine with Spark</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setNewThreadPreview(prev => !prev)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        {newThreadPreview ? 'Edit text' : 'Live preview'}
                      </button>
                    </div>
                  </div>

                  {newThreadPreview ? (
                    <div className="min-h-[140px] rounded-xl border border-white/10 bg-[#07070b] p-3.5 text-xs text-white/90">
                      {newThreadContent.trim() ? (
                        renderFormattedContent(newThreadContent)
                      ) : (
                        <span className="text-white/30 italic">No content to preview.</span>
                      )}
                    </div>
                  ) : (
                    <textarea
                      required
                      minLength={20}
                      rows={6}
                      placeholder="Explain your algorithmic problem, question, or approach in detail..."
                      value={newThreadContent}
                      onChange={(e) => setNewThreadContent(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#07070b] p-3.5 text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none transition-all font-sans leading-relaxed"
                    />
                  )}
                </div>

                {/* Optional Code Snippet */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-semibold text-white/70">
                      Optional Code Snippet
                    </label>
                    <select
                      value={newThreadCodeLang}
                      onChange={(e) => setNewThreadCodeLang(e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/80"
                    >
                      <option value="python" className="bg-[#12121c]">Python</option>
                      <option value="javascript" className="bg-[#12121c]">JavaScript</option>
                      <option value="typescript" className="bg-[#12121c]">TypeScript</option>
                      <option value="cpp" className="bg-[#12121c]">C++</option>
                      <option value="java" className="bg-[#12121c]">Java</option>
                      <option value="sql" className="bg-[#12121c]">SQL</option>
                      <option value="bash" className="bg-[#12121c]">Bash</option>
                    </select>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="def solve(nums):&#10;    # Write code here"
                    value={newThreadCode}
                    onChange={(e) => setNewThreadCode(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#07070b] p-3 font-mono text-xs text-amber-300/90 placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none transition-all leading-relaxed"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsCreatingThread(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    Post Discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: REPORT INAPPROPRIATE CONTENT                                       */}
        {/* ========================================================================= */}
        {reportingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div 
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-bold text-sm text-white">Report Content</h3>
                </div>
                <button 
                  onClick={() => setReportingPost(null)}
                  className="rounded-lg p-1 text-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <p className="text-white/60 leading-relaxed">
                  Help maintain CodeSpark forum standards. Please let us know why this post is inappropriate:
                </p>

                <div className="space-y-2">
                  {[
                    'Off-topic or spam',
                    'Inappropriate or offensive language',
                    'Incorrect technical information or code safety risk',
                    'Harassment or personal attack'
                  ].map(reason => (
                    <label 
                      key={reason}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/[0.06] hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="accent-amber-400"
                      />
                      <span className="text-white/80">{reason}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingPost(null)}
                    className="rounded-xl px-3 py-1.5 text-xs text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-red-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-400 transition-all cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
