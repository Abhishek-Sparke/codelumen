import { 
  ForumSection, ForumCategory, DiscussionPost, DiscussionComment, 
  ForumReactionType, ForumAuthor, PaginatedDiscussionsResult 
} from '../types';
import { FORUM_SECTIONS, FORUM_CATEGORIES, INITIAL_FORUM_POSTS, DISCUSSION_RULES_THREAD } from '../data/forumData';
import { StorageService } from './storage';
import { SecuritySanitizer } from './securitySanitizer';

const FORUM_STORAGE_KEY = 'codespark_forum_threads';
const VIEWED_THREADS_KEY = 'codespark_viewed_threads';
const DRAFT_STORAGE_PREFIX = 'codespark_discussion_draft_';

export interface DiscussionDraft {
  title: string;
  categoryId: string;
  content: string;
  tags: string;
  codeSnippet?: { language: string; code: string };
  lastSavedAt: number;
}

export class ForumService {
  /**
   * Internal helper to read threads from localStorage with fallback to initial seed.
   */
  private static loadStoredThreads(): DiscussionPost[] {
    try {
      const stored = localStorage.getItem(FORUM_STORAGE_KEY);
      if (stored) {
        const parsed: DiscussionPost[] = JSON.parse(stored);
        // Guarantee system discussion rules thread is present
        if (!parsed.some(t => t.system_type === 'discussion_rules' || t.id === 'rules' || t.id === 'discussion-rules')) {
          parsed.unshift(DISCUSSION_RULES_THREAD);
          try {
            localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(parsed));
          } catch {}
        }
        return parsed;
      }
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(INITIAL_FORUM_POSTS));
      return INITIAL_FORUM_POSTS;
    } catch {
      return INITIAL_FORUM_POSTS;
    }
  }

  /**
   * Internal helper to persist threads to localStorage.
   */
  public static saveThreads(threads: DiscussionPost[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(threads));
      StorageService.saveDiscussions(threads);
    } catch (e) {
      console.error('Failed to persist forum threads', e);
    }
  }

  /**
   * Returns all top-level forum sections with their child categories.
   */
  public static getSections(): ForumSection[] {
    const categories = this.getCategories();
    return FORUM_SECTIONS.map(section => ({
      ...section,
      categories: categories.filter(c => c.sectionId === section.id)
    }));
  }

  /**
   * Returns all categories with live dynamic thread and post counts.
   */
  public static getCategories(): ForumCategory[] {
    const threads = this.loadStoredThreads();
    return FORUM_CATEGORIES.map(cat => {
      const catThreads = threads.filter(t => t.categoryId === cat.id || t.slug === cat.slug);
      const totalPosts = catThreads.reduce((acc, t) => acc + 1 + (t.comments?.length || 0), 0);
      const sorted = [...catThreads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = sorted[0];

      return {
        ...cat,
        threadCount: Math.max(cat.threadCount, catThreads.length),
        postCount: Math.max(cat.postCount, totalPosts),
        latestThread: latest
          ? {
              id: latest.id,
              title: latest.title,
              authorName: latest.author.name,
              lastActivity: latest.lastActivityAt || latest.createdAt
            }
          : cat.latestThread
      };
    });
  }

  /**
   * Returns a single category by slug or id.
   */
  public static getCategoryByIdOrSlug(idOrSlug: string): ForumCategory | undefined {
    const categories = this.getCategories();
    const query = (idOrSlug || '').toLowerCase().trim();
    return categories.find(c => 
      c.id.toLowerCase() === query || 
      c.slug.toLowerCase() === query ||
      c.name.toLowerCase().replace(/\s+/g, '-') === query
    );
  }

  /**
   * Retrieves all threads, optionally filtered by category, search query, or tab filter.
   * Supports 20 items per page pagination.
   */
  public static getThreads(
    categoryId?: string,
    filter: 'all' | 'latest' | 'popular' | 'unanswered' | 'solved' | 'saved' | 'my-discussions' | 'watched' = 'all',
    searchQuery: string = '',
    currentUserId?: string,
    page: number = 1,
    limit: number = 20,
    tag?: string
  ): PaginatedDiscussionsResult {
    let threads = this.loadStoredThreads();

    // 1. Filter by category
    if (categoryId && categoryId !== 'all') {
      threads = threads.filter(t => t.categoryId === categoryId || t.slug === categoryId);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      threads = threads.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        t.author.name.toLowerCase().includes(q) ||
        t.author.username.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q)) ||
        t.categoryName?.toLowerCase().includes(q)
      );
    }

    // 3. Filter by tag
    if (tag) {
      const tLower = tag.toLowerCase();
      threads = threads.filter(t => t.tags?.some(x => x.toLowerCase() === tLower));
    }

    // 4. Tab filtering & Sorting
    if (filter === 'latest') {
      threads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filter === 'popular') {
      threads.sort((a, b) => {
        const popA = (a.views || 0) + (a.comments?.length || 0) * 3 + (a.likes || 0) * 2;
        const popB = (b.views || 0) + (b.comments?.length || 0) * 3 + (b.likes || 0) * 2;
        return popB - popA;
      });
    } else if (filter === 'unanswered') {
      threads = threads.filter(t => !t.comments || t.comments.length === 0);
    } else if (filter === 'solved') {
      threads = threads.filter(t => t.isSolved === true);
    } else if (filter === 'saved' && currentUserId) {
      threads = threads.filter(t => t.bookmarkedByUserIds?.includes(currentUserId));
    } else if (filter === 'my-discussions' && currentUserId) {
      threads = threads.filter(t => t.author.id === currentUserId);
    } else if (filter === 'watched' && currentUserId) {
      threads = threads.filter(t => t.watchedByUserIds?.includes(currentUserId));
    }

    // 5. Pinned threads stay pinned on top
    threads.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    const totalCount = threads.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const validPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validPage - 1) * limit;
    const paginated = threads.slice(startIndex, startIndex + limit);

    return {
      threads: paginated,
      totalCount,
      page: validPage,
      totalPages,
      limit
    };
  }

  /**
   * Retrieves a single thread by id or slug with view deduplication.
   */
  public static getThreadByIdOrSlug(
    idOrSlug: string,
    currentUserId?: string,
    incrementView: boolean = true
  ): DiscussionPost | undefined {
    const threads = this.loadStoredThreads();
    const normalized = (idOrSlug || '').toLowerCase().trim();
    const isRulesQuery = normalized === 'rules' || normalized === 'discussion-rules' || normalized === 'server-and-forum-rules';

    const thread = threads.find(t => 
      t.id.toLowerCase() === normalized || 
      (t.slug && t.slug.toLowerCase() === normalized) || 
      (isRulesQuery && (t.system_type === 'discussion_rules' || t.id === 'rules' || t.id === 'discussion-rules' || t.slug === 'rules' || t.slug === 'discussion-rules'))
    ) || (isRulesQuery ? DISCUSSION_RULES_THREAD : undefined);

    if (!thread) return undefined;

    if (incrementView && !thread.is_system_discussion) {
      try {
        const key = currentUserId ? `${VIEWED_THREADS_KEY}_${currentUserId}` : `${VIEWED_THREADS_KEY}_anon`;
        const rawViewed = sessionStorage.getItem(key);
        const viewedSet: string[] = rawViewed ? JSON.parse(rawViewed) : [];

        if (!viewedSet.includes(thread.id)) {
          viewedSet.push(thread.id);
          sessionStorage.setItem(key, JSON.stringify(viewedSet));
          thread.views = (thread.views || 0) + 1;
          this.saveThreads(threads);
        }
      } catch {
        thread.views = (thread.views || 0) + 1;
        this.saveThreads(threads);
      }
    }

    return thread;
  }

  /**
   * Backwards compatible getThreadById.
   */
  public static getThreadById(id: string): DiscussionPost | undefined {
    return this.getThreadByIdOrSlug(id, undefined, false);
  }

  /**
   * Architecture for future Admin / Moderator content management of Discussion Rules.
   * Strictly enforces role authorization (Admin or Moderator only).
   */
  public static updateDiscussionRules(
    content: string,
    isPublished: boolean,
    userRole?: string
  ): { success: boolean; error?: string } {
    if (userRole !== 'admin' && userRole !== 'moderator') {
      return { success: false, error: 'Unauthorized: Only admins and moderators can manage discussion rules.' };
    }
    const threads = this.loadStoredThreads();
    const rulesIndex = threads.findIndex(t => t.system_type === 'discussion_rules' || t.id === 'discussion-rules');
    if (rulesIndex >= 0) {
      threads[rulesIndex].content = isPublished ? content : '';
      threads[rulesIndex].lastActivityAt = new Date().toISOString();
      this.saveThreads(threads);
      return { success: true };
    }
    return { success: false, error: 'Discussion rules record not found.' };
  }

  /**
   * Creates a new thread with rate limiting, slug generation, and validation.
   */
  public static createThread(data: {
    title: string;
    content: string;
    categoryId: string;
    tags: string[];
    author: ForumAuthor;
    codeSnippet?: { language: string; code: string };
  }): { success: boolean; thread?: DiscussionPost; error?: string } {
    if (!data.title || data.title.trim().length < 5) {
      return { success: false, error: 'Title must be at least 5 characters long.' };
    }
    if (!data.content || data.content.trim().length < 20) {
      return { success: false, error: 'Discussion content must be at least 20 characters long.' };
    }
    if (data.tags && data.tags.length > 5) {
      return { success: false, error: 'Maximum 5 tags allowed.' };
    }

    const threads = this.loadStoredThreads();

    // Collision-safe slug generation
    let baseSlug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!baseSlug) baseSlug = 'discussion';

    let slug = baseSlug;
    let counter = 2;
    while (threads.some(t => t.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const category = this.getCategoryByIdOrSlug(data.categoryId);
    const safeContent = SecuritySanitizer.limitQuoteNesting(data.content.trim());

    const newThread: DiscussionPost = {
      id: `disc-${Date.now()}`,
      slug,
      title: data.title.trim(),
      categoryId: category?.id || 'cat-dsa',
      categoryName: category?.name || 'DSA & Problem Solving',
      sectionId: category?.sectionId || 'learn',
      author: data.author,
      content: safeContent,
      tags: data.tags.length > 0 ? data.tags : ['Discussion'],
      codeSnippet: data.codeSnippet,
      likes: 0,
      hasLiked: false,
      reactions: { like: [], love: [], helpful: [], great: [] },
      commentsCount: 0,
      views: 1,
      createdAt: 'Just now',
      lastActivityAt: 'Just now',
      isPinned: false,
      isLocked: false,
      isSolved: false,
      watchedByUserIds: [data.author.id],
      bookmarkedByUserIds: [],
      comments: []
    };

    threads.unshift(newThread);
    this.saveThreads(threads);

    // Also dispatch to API if available
    try {
      fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': data.author.id },
        body: JSON.stringify(data)
      }).catch(() => {});
    } catch {}

    return { success: true, thread: newThread };
  }

  /**
   * Adds a reply to a thread with locked-thread protection and sequential numbering.
   */
  public static addReply(
    threadIdOrSlug: string,
    content: string,
    author: ForumAuthor,
    replyToPostNumber?: number,
    replyToAuthor?: string
  ): { success: boolean; comment?: DiscussionComment; error?: string } {
    if (!content.trim()) {
      return { success: false, error: 'Reply cannot be empty.' };
    }

    const threads = this.loadStoredThreads();
    const thread = threads.find(t => t.id === threadIdOrSlug || t.slug === threadIdOrSlug);
    if (!thread) return { success: false, error: 'Thread not found.' };

    if (thread.isLocked) {
      return { success: false, error: 'This discussion is locked and no further replies can be added.' };
    }

    const nextPostNumber = (thread.comments?.length || 0) + 2;
    const safeContent = SecuritySanitizer.limitQuoteNesting(content.trim());

    const newComment: DiscussionComment = {
      id: `c-${Date.now()}`,
      postNumber: nextPostNumber,
      author,
      content: safeContent,
      createdAt: 'Just now',
      likes: 0,
      hasLiked: false,
      reactions: { like: [], love: [], helpful: [], great: [] },
      replyToPostNumber,
      replyToAuthor,
      isAcceptedAnswer: false
    };

    if (!thread.comments) thread.comments = [];
    thread.comments.push(newComment);
    thread.commentsCount = thread.comments.length;
    thread.lastActivityAt = 'Just now';

    this.saveThreads(threads);

    // Also dispatch to API
    try {
      fetch(`/api/discussions/${thread.slug || thread.id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': author.id },
        body: JSON.stringify({ content, author, replyToPostNumber, replyToAuthor })
      }).catch(() => {});
    } catch {}

    return { success: true, comment: newComment };
  }

  /**
   * Single reaction per user per post toggle/switch.
   */
  public static toggleReaction(
    threadIdOrSlug: string,
    postId: string,
    reactionType: ForumReactionType,
    userId: string
  ): { success: boolean; reactions?: Record<ForumReactionType, string[]> } {
    const threads = this.loadStoredThreads();
    const thread = threads.find(t => t.id === threadIdOrSlug || t.slug === threadIdOrSlug);
    if (!thread) return { success: false };

    let targetReactions: Record<ForumReactionType, string[]> | undefined;

    if (postId === thread.id || postId === 'post-1' || postId === 'thread') {
      if (!thread.reactions) thread.reactions = { like: [], love: [], helpful: [], great: [] };
      targetReactions = thread.reactions;
    } else {
      const comment = thread.comments?.find(c => c.id === postId);
      if (!comment) return { success: false };
      if (!comment.reactions) comment.reactions = { like: [], love: [], helpful: [], great: [] };
      targetReactions = comment.reactions;
    }

    const types: ForumReactionType[] = ['like', 'love', 'helpful', 'great'];
    const hasCurrentReaction = targetReactions[reactionType]?.includes(userId);

    // Single reaction rule: remove user from all reactions on this post
    types.forEach(t => {
      targetReactions![t] = targetReactions![t].filter(uid => uid !== userId);
    });

    if (!hasCurrentReaction) {
      targetReactions[reactionType].push(userId);
    }

    this.saveThreads(threads);

    try {
      fetch(`/api/discussions/posts/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ threadId: thread.id, reactionType, userId })
      }).catch(() => {});
    } catch {}

    return { success: true, reactions: targetReactions };
  }

  /**
   * Marks or unmarks a reply as Accepted Answer.
   * Only allowed for discussion author or moderators/admins.
   */
  public static markAcceptedAnswer(
    threadIdOrSlug: string,
    postId: string,
    userId: string,
    userRole: string = 'user'
  ): { success: boolean; isSolved?: boolean; acceptedPostId?: string; error?: string } {
    const threads = this.loadStoredThreads();
    const thread = threads.find(t => t.id === threadIdOrSlug || t.slug === threadIdOrSlug);
    if (!thread) return { success: false, error: 'Thread not found' };

    const isAuthor = thread.author.id === userId;
    const isModerator = userRole === 'admin' || userRole === 'moderator';

    if (!isAuthor && !isModerator) {
      return { success: false, error: 'Only the thread author or a moderator can mark the accepted answer.' };
    }

    const comment = thread.comments?.find(c => c.id === postId);
    if (!comment) return { success: false, error: 'Reply not found' };

    if (comment.isAcceptedAnswer) {
      comment.isAcceptedAnswer = false;
      thread.isSolved = false;
      thread.acceptedPostId = undefined;
    } else {
      thread.comments?.forEach(c => { c.isAcceptedAnswer = false; });
      comment.isAcceptedAnswer = true;
      thread.isSolved = true;
      thread.acceptedPostId = postId;
    }

    this.saveThreads(threads);

    try {
      fetch(`/api/discussions/posts/${postId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ threadId: thread.id, userRole })
      }).catch(() => {});
    } catch {}

    return { success: true, isSolved: thread.isSolved, acceptedPostId: thread.acceptedPostId };
  }

  /**
   * Moderation controls: lock, unlock, pin, unpin, delete.
   */
  public static moderationAction(
    threadIdOrSlug: string,
    action: 'lock' | 'unlock' | 'pin' | 'unpin' | 'delete' | 'mark_solved' | 'unmark_solved',
    userId: string,
    userRole: string = 'user'
  ): { success: boolean; thread?: DiscussionPost; error?: string } {
    if (userRole !== 'admin' && userRole !== 'moderator') {
      return { success: false, error: 'Forbidden: Moderator privileges required.' };
    }

    let threads = this.loadStoredThreads();
    const thread = threads.find(t => t.id === threadIdOrSlug || t.slug === threadIdOrSlug);
    if (!thread) return { success: false, error: 'Thread not found' };

    switch (action) {
      case 'lock':
        thread.isLocked = true;
        break;
      case 'unlock':
        thread.isLocked = false;
        break;
      case 'pin':
        thread.isPinned = true;
        break;
      case 'unpin':
        thread.isPinned = false;
        break;
      case 'mark_solved':
        thread.isSolved = true;
        break;
      case 'unmark_solved':
        thread.isSolved = false;
        thread.acceptedPostId = undefined;
        thread.comments?.forEach(c => { c.isAcceptedAnswer = false; });
        break;
      case 'delete':
        threads = threads.filter(t => t.id !== thread.id);
        this.saveThreads(threads);
        return { success: true };
    }

    this.saveThreads(threads);

    try {
      fetch(`/api/discussions/${thread.slug || thread.id}/moderation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId, 'x-user-role': userRole },
        body: JSON.stringify({ action, userId, userRole })
      }).catch(() => {});
    } catch {}

    return { success: true, thread };
  }

  /**
   * Toggles watch state on a thread.
   */
  public static toggleWatchThread(threadIdOrSlug: string, userId: string): boolean {
    const threads = this.loadStoredThreads();
    const thread = threads.find(t => t.id === threadIdOrSlug || t.slug === threadIdOrSlug);
    if (!thread) return false;

    if (!thread.watchedByUserIds) thread.watchedByUserIds = [];
    const idx = thread.watchedByUserIds.indexOf(userId);
    let isWatching = false;
    if (idx > -1) {
      thread.watchedByUserIds.splice(idx, 1);
    } else {
      thread.watchedByUserIds.push(userId);
      isWatching = true;
    }
    this.saveThreads(threads);

    try {
      fetch(`/api/discussions/${thread.slug || thread.id}/watch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ userId })
      }).catch(() => {});
    } catch {}

    return isWatching;
  }

  /**
   * Toggles bookmark/saved state on a thread.
   */
  public static toggleBookmarkThread(threadIdOrSlug: string, userId: string): boolean {
    const threads = this.loadStoredThreads();
    const thread = threads.find(t => t.id === threadIdOrSlug || t.slug === threadIdOrSlug);
    if (!thread) return false;

    if (!thread.bookmarkedByUserIds) thread.bookmarkedByUserIds = [];
    const idx = thread.bookmarkedByUserIds.indexOf(userId);
    let isBookmarked = false;
    if (idx > -1) {
      thread.bookmarkedByUserIds.splice(idx, 1);
    } else {
      thread.bookmarkedByUserIds.push(userId);
      isBookmarked = true;
    }
    this.saveThreads(threads);

    try {
      fetch(`/api/discussions/${thread.slug || thread.id}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ userId })
      }).catch(() => {});
    } catch {}

    return isBookmarked;
  }

  /**
   * Discussion Draft Management
   */
  public static saveDraft(userId: string, draft: Omit<DiscussionDraft, 'lastSavedAt'>): void {
    try {
      const payload: DiscussionDraft = { ...draft, lastSavedAt: Date.now() };
      localStorage.setItem(`${DRAFT_STORAGE_PREFIX}${userId}`, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  }

  public static getDraft(userId: string): DiscussionDraft | null {
    try {
      const raw = localStorage.getItem(`${DRAFT_STORAGE_PREFIX}${userId}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static clearDraft(userId: string): void {
    try {
      localStorage.removeItem(`${DRAFT_STORAGE_PREFIX}${userId}`);
    } catch {}
  }

  /**
   * Report inappropriate content.
   */
  public static reportContent(targetId: string, reason: string, reporterId?: string): void {
    try {
      const reports = JSON.parse(localStorage.getItem('codespark_forum_reports') || '[]');
      reports.push({
        id: `rep-${Date.now()}`,
        targetId,
        reason,
        reporterId: reporterId || 'anonymous',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('codespark_forum_reports', JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to submit report', e);
    }
  }
}
