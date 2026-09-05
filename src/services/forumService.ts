import { 
  ForumSection, ForumCategory, DiscussionPost, DiscussionComment, 
  ForumReactionType, ForumAuthor 
} from '../types';
import { FORUM_SECTIONS, FORUM_CATEGORIES, INITIAL_FORUM_POSTS } from '../data/forumData';
import { StorageService } from './storage';

const FORUM_STORAGE_KEY = 'codespark_forum_threads';

export class ForumService {
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
    const threads = this.getThreads();
    return FORUM_CATEGORIES.map(cat => {
      const catThreads = threads.filter(t => t.categoryId === cat.id || t.slug === cat.slug);
      const totalPosts = catThreads.reduce((acc, t) => acc + 1 + (t.comments?.length || 0), 0);
      const latest = catThreads.length > 0 ? catThreads[0] : undefined;

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
    return categories.find(c => c.id === idOrSlug || c.slug === idOrSlug);
  }

  /**
   * Retrieves all threads, optionally filtered by category, search query, or tab filter.
   */
  public static getThreads(
    categoryId?: string,
    filter: 'all' | 'latest' | 'popular' | 'unanswered' | 'my-discussions' | 'watched' = 'all',
    searchQuery: string = '',
    currentUserId?: string
  ): DiscussionPost[] {
    let threads: DiscussionPost[] = [];
    try {
      const stored = localStorage.getItem(FORUM_STORAGE_KEY);
      if (stored) {
        threads = JSON.parse(stored);
      } else {
        threads = INITIAL_FORUM_POSTS;
        localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(threads));
      }
    } catch {
      threads = INITIAL_FORUM_POSTS;
    }

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
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // 3. Filter by tab
    if (filter === 'popular') {
      threads = [...threads].sort((a, b) => ((b.likes || 0) + (b.commentsCount || 0)) - ((a.likes || 0) + (a.commentsCount || 0)));
    } else if (filter === 'unanswered') {
      threads = threads.filter(t => (t.commentsCount || 0) === 0);
    } else if (filter === 'my-discussions' && currentUserId) {
      threads = threads.filter(t => t.author.id === currentUserId);
    } else if (filter === 'watched' && currentUserId) {
      threads = threads.filter(t => t.watchedByUserIds?.includes(currentUserId) || t.bookmarkedByUserIds?.includes(currentUserId));
    } else {
      // Latest or default
      threads = [...threads].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.id > a.id ? 1 : -1);
      });
    }

    return threads;
  }

  /**
   * Retrieves a single thread by ID and increments view count.
   */
  public static getThreadById(threadId: string, incrementView: boolean = true): DiscussionPost | undefined {
    const threads = this.getThreads();
    const thread = threads.find(t => t.id === threadId || t.slug === threadId);
    if (!thread) return undefined;

    if (incrementView) {
      thread.views = (thread.views || 0) + 1;
      this.saveThreads(threads);
    }

    return thread;
  }

  /**
   * Creates a new thread discussion.
   */
  public static createThread(data: {
    title: string;
    content: string;
    categoryId: string;
    tags: string[];
    author: ForumAuthor;
    problemId?: string;
    problemTitle?: string;
  }): DiscussionPost {
    const threads = this.getThreads();
    const category = FORUM_CATEGORIES.find(c => c.id === data.categoryId) || FORUM_CATEGORIES[0];

    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newThread: DiscussionPost = {
      id: `thread-${Date.now()}`,
      slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
      title: data.title,
      categoryId: category.id,
      categoryName: category.name,
      sectionId: category.sectionId,
      problemId: data.problemId,
      problemTitle: data.problemTitle,
      author: data.author,
      content: data.content,
      tags: data.tags.length > 0 ? data.tags : ['General'],
      likes: 1,
      hasLiked: true,
      reactions: {
        like: [data.author.id],
        love: [],
        helpful: [],
        great: []
      },
      commentsCount: 0,
      views: 1,
      createdAt: 'Just now',
      lastActivityAt: 'Just now',
      isPinned: false,
      isLocked: false,
      watchedByUserIds: [data.author.id],
      bookmarkedByUserIds: [],
      comments: []
    };

    threads.unshift(newThread);
    this.saveThreads(threads);
    return newThread;
  }

  /**
   * Adds a reply to an existing thread.
   */
  public static addReply(
    threadId: string,
    content: string,
    author: ForumAuthor,
    replyToPostNumber?: number,
    replyToAuthor?: string
  ): DiscussionPost | undefined {
    const threads = this.getThreads();
    const thread = threads.find(t => t.id === threadId || t.slug === threadId);
    if (!thread || thread.isLocked) return undefined;

    const nextPostNumber = (thread.comments?.length || 0) + 2; // Post #1 is the OP
    const newComment: DiscussionComment = {
      id: `c-${Date.now()}`,
      postNumber: nextPostNumber,
      author,
      content,
      createdAt: 'Just now',
      likes: 0,
      hasLiked: false,
      reactions: {
        like: [],
        love: [],
        helpful: [],
        great: []
      },
      replyToPostNumber,
      replyToAuthor
    };

    thread.comments = thread.comments || [];
    thread.comments.push(newComment);
    thread.commentsCount = thread.comments.length;
    thread.lastActivityAt = 'Just now';

    this.saveThreads(threads);
    return thread;
  }

  /**
   * Toggles a reaction (like, love, helpful, great) on a post (#1 is thread OP, #2+ are comments).
   */
  public static toggleReaction(
    threadId: string,
    postNumber: number,
    reactionType: ForumReactionType,
    userId: string
  ): DiscussionPost | undefined {
    const threads = this.getThreads();
    const thread = threads.find(t => t.id === threadId || t.slug === threadId);
    if (!thread) return undefined;

    if (postNumber === 1) {
      // Reacting to the original post (thread)
      thread.reactions = thread.reactions || { like: [], love: [], helpful: [], great: [] };
      const currentList = thread.reactions[reactionType] || [];
      const hasReacted = currentList.includes(userId);

      if (hasReacted) {
        thread.reactions[reactionType] = currentList.filter(id => id !== userId);
        if (reactionType === 'like') {
          thread.likes = Math.max(0, (thread.likes || 1) - 1);
          thread.hasLiked = false;
        }
      } else {
        thread.reactions[reactionType] = [...currentList, userId];
        if (reactionType === 'like') {
          thread.likes = (thread.likes || 0) + 1;
          thread.hasLiked = true;
        }
      }
    } else {
      // Reacting to a reply comment
      const commentIndex = postNumber - 2;
      if (thread.comments && thread.comments[commentIndex]) {
        const comment = thread.comments[commentIndex];
        comment.reactions = comment.reactions || { like: [], love: [], helpful: [], great: [] };
        const currentList = comment.reactions[reactionType] || [];
        const hasReacted = currentList.includes(userId);

        if (hasReacted) {
          comment.reactions[reactionType] = currentList.filter(id => id !== userId);
          if (reactionType === 'like') {
            comment.likes = Math.max(0, (comment.likes || 1) - 1);
            comment.hasLiked = false;
          }
        } else {
          comment.reactions[reactionType] = [...currentList, userId];
          if (reactionType === 'like') {
            comment.likes = (comment.likes || 0) + 1;
            comment.hasLiked = true;
          }
        }
      }
    }

    this.saveThreads(threads);
    return thread;
  }

  /**
   * Toggles watching a thread.
   */
  public static toggleWatchThread(threadId: string, userId: string): boolean {
    const threads = this.getThreads();
    const thread = threads.find(t => t.id === threadId || t.slug === threadId);
    if (!thread) return false;

    thread.watchedByUserIds = thread.watchedByUserIds || [];
    const isWatched = thread.watchedByUserIds.includes(userId);

    if (isWatched) {
      thread.watchedByUserIds = thread.watchedByUserIds.filter(id => id !== userId);
    } else {
      thread.watchedByUserIds.push(userId);
    }

    this.saveThreads(threads);
    return !isWatched;
  }

  /**
   * Toggles bookmarking a thread.
   */
  public static toggleBookmarkThread(threadId: string, userId: string): boolean {
    const threads = this.getThreads();
    const thread = threads.find(t => t.id === threadId || t.slug === threadId);
    if (!thread) return false;

    thread.bookmarkedByUserIds = thread.bookmarkedByUserIds || [];
    const isBookmarked = thread.bookmarkedByUserIds.includes(userId);

    if (isBookmarked) {
      thread.bookmarkedByUserIds = thread.bookmarkedByUserIds.filter(id => id !== userId);
    } else {
      thread.bookmarkedByUserIds.push(userId);
    }

    this.saveThreads(threads);
    return !isBookmarked;
  }

  /**
   * Reports inappropriate content.
   */
  public static reportContent(targetId: string, reason: string, userId: string): boolean {
    try {
      const reports = JSON.parse(localStorage.getItem('codespark_forum_reports') || '[]');
      reports.push({
        id: `report-${Date.now()}`,
        targetId,
        reason,
        userId,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('codespark_forum_reports', JSON.stringify(reports));
      return true;
    } catch {
      return true;
    }
  }

  private static saveThreads(threads: DiscussionPost[]) {
    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(threads));
      // Keep legacy storage key in sync so existing widgets don't break
      StorageService.saveDiscussions(threads);
    } catch (e) {
      console.error('Failed to save forum threads:', e);
    }
  }
}
