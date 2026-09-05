import { FORUM_CATEGORIES, FORUM_SECTIONS, INITIAL_FORUM_POSTS } from '../src/data/forumData.ts';
import type {
  DiscussionPost,
  DiscussionComment,
  ForumCategory,
  ForumSection,
  ForumReactionType,
  CreateDiscussionRequest,
  CreateReplyRequest,
  ModerationActionRequest,
  PaginatedDiscussionsResult
} from '../src/types/index.ts';
import { SecuritySanitizer } from '../src/services/securitySanitizer.ts';

// Server-side in-memory forum store initialized with seed records
let forumThreads: DiscussionPost[] = JSON.parse(JSON.stringify(INITIAL_FORUM_POSTS));
let forumCategories: ForumCategory[] = JSON.parse(JSON.stringify(FORUM_CATEGORIES));

// Rate limiting trackers (User action timestamps)
const userLastCreatedDiscussion: Record<string, number> = {};
const userLastCreatedReply: Record<string, number> = {};
const userReactionTimestamps: Record<string, number[]> = {};

// View deduplication tracker: userId/ip -> Set of thread slugs/ids viewed
const viewedThreadTracker: Record<string, Set<string>> = {};

/**
 * URL-safe slug generator with collision resolution.
 */
function generateSlug(title: string, existingThreads: DiscussionPost[]): string {
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!baseSlug) baseSlug = 'discussion';

  let slug = baseSlug;
  let counter = 2;
  while (existingThreads.some(t => t.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

/**
 * Handle GET /api/discussions/categories
 */
export async function handleGetCategories(): Promise<{ success: boolean; sections: ForumSection[]; categories: ForumCategory[] }> {
  // Recalculate real dynamic thread and post counts
  const updatedCategories = forumCategories.map(cat => {
    const catThreads = forumThreads.filter(t => t.categoryId === cat.id || t.slug === cat.slug);
    const totalPosts = catThreads.reduce((sum, t) => sum + (t.comments?.length || 0) + 1, 0);
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

  const updatedSections = FORUM_SECTIONS.map(sec => ({
    ...sec,
    categories: updatedCategories.filter(c => c.sectionId === sec.id)
  }));

  return {
    success: true,
    sections: updatedSections,
    categories: updatedCategories
  };
}

/**
 * Handle GET /api/discussions
 */
export async function handleGetDiscussions(params: {
  category?: string;
  filter?: string;
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
  userId?: string;
}): Promise<{ success: boolean; result: PaginatedDiscussionsResult }> {
  const {
    category,
    filter = 'all',
    search = '',
    tag,
    page = 1,
    limit = 20,
    userId
  } = params;

  let filtered = [...forumThreads];

  // 1. Category Filter
  if (category && category !== 'all') {
    filtered = filtered.filter(t => t.categoryId === category || t.slug === category);
  }

  // 2. Tab Filter
  if (filter === 'latest') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (filter === 'popular') {
    filtered.sort((a, b) => {
      const popA = (a.views || 0) + (a.comments?.length || 0) * 3 + (a.likes || 0) * 2;
      const popB = (b.views || 0) + (b.comments?.length || 0) * 3 + (b.likes || 0) * 2;
      return popB - popA;
    });
  } else if (filter === 'unanswered') {
    filtered = filtered.filter(t => !t.comments || t.comments.length === 0);
  } else if (filter === 'solved') {
    filtered = filtered.filter(t => t.isSolved === true);
  } else if (filter === 'saved' && userId) {
    filtered = filtered.filter(t => t.bookmarkedByUserIds?.includes(userId));
  } else if (filter === 'my-discussions' && userId) {
    filtered = filtered.filter(t => t.author.id === userId);
  } else if (filter === 'watched' && userId) {
    filtered = filtered.filter(t => t.watchedByUserIds?.includes(userId));
  }

  // 3. Search Query
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q) ||
      t.author.username.toLowerCase().includes(q) ||
      t.author.name.toLowerCase().includes(q) ||
      t.tags?.some(tag => tag.toLowerCase().includes(q)) ||
      t.categoryName?.toLowerCase().includes(q)
    );
  }

  // 4. Tag Filter
  if (tag) {
    const tLower = tag.toLowerCase();
    filtered = filtered.filter(t => t.tags?.some(x => x.toLowerCase() === tLower));
  }

  // 5. Pinned sorting: pinned threads stay on top unless specifically sorted
  filtered.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * limit;
  const paginatedThreads = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    result: {
      threads: paginatedThreads,
      totalCount,
      page: currentPage,
      totalPages,
      limit
    }
  };
}

/**
 * Handle GET /api/discussions/:slug
 */
export async function handleGetDiscussionBySlug(
  slugOrId: string,
  userId?: string,
  incrementView: boolean = true
): Promise<{ success: boolean; thread?: DiscussionPost; error?: string }> {
  const thread = forumThreads.find(t => t.slug === slugOrId || t.id === slugOrId);
  if (!thread) {
    return { success: false, error: 'Discussion not found' };
  }

  // View count deduplication per session/user
  if (incrementView && userId) {
    if (!viewedThreadTracker[userId]) {
      viewedThreadTracker[userId] = new Set();
    }
    if (!viewedThreadTracker[userId].has(thread.id)) {
      viewedThreadTracker[userId].add(thread.id);
      thread.views = (thread.views || 0) + 1;
    }
  } else if (incrementView && !userId) {
    // For anonymous visitors, deduplicate with generic key
    const anonKey = 'anon-session';
    if (!viewedThreadTracker[anonKey]) {
      viewedThreadTracker[anonKey] = new Set();
    }
    if (!viewedThreadTracker[anonKey].has(thread.id)) {
      viewedThreadTracker[anonKey].add(thread.id);
      thread.views = (thread.views || 0) + 1;
    }
  }

  return { success: true, thread };
}

/**
 * Handle POST /api/discussions
 */
export async function handleCreateDiscussion(
  body: CreateDiscussionRequest,
  userId: string
): Promise<{ success: boolean; thread?: DiscussionPost; error?: string }> {
  // 1. Validation
  if (!userId) {
    return { success: false, error: 'Unauthorized: Authentication required to create a discussion.' };
  }
  if (!body.title || body.title.trim().length < 5) {
    return { success: false, error: 'Validation Error: Title must be at least 5 characters.' };
  }
  if (!body.content || body.content.trim().length < 20) {
    return { success: false, error: 'Validation Error: Content must be at least 20 characters.' };
  }
  if (body.tags && body.tags.length > 5) {
    return { success: false, error: 'Validation Error: Maximum 5 tags allowed.' };
  }

  // 2. Rate Limiting (30s cooldown)
  const now = Date.now();
  const lastCreated = userLastCreatedDiscussion[userId] || 0;
  if (now - lastCreated < 30_000) {
    const waitSec = Math.ceil((30_000 - (now - lastCreated)) / 1000);
    return { success: false, error: `Rate limit: Please wait ${waitSec}s before creating another discussion.` };
  }
  userLastCreatedDiscussion[userId] = now;

  // 3. Category lookup
  const category = forumCategories.find(c => c.id === body.categoryId || c.slug === body.categoryId);
  const categoryName = category?.name || 'DSA & Problem Solving';
  const sectionId = category?.sectionId || 'learn';

  // 4. Sanitization
  const safeContent = SecuritySanitizer.limitQuoteNesting(body.content.trim());
  const slug = generateSlug(body.title, forumThreads);

  const newThread: DiscussionPost = {
    id: `disc-${Date.now()}`,
    slug,
    title: body.title.trim(),
    categoryId: category?.id || 'cat-dsa',
    categoryName,
    sectionId,
    author: body.author,
    content: safeContent,
    tags: body.tags || [],
    codeSnippet: body.codeSnippet,
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
    watchedByUserIds: [userId],
    bookmarkedByUserIds: [],
    comments: []
  };

  forumThreads.unshift(newThread);

  return { success: true, thread: newThread };
}

/**
 * Handle POST /api/discussions/:slug/posts (Replies)
 */
export async function handleCreateReply(
  slugOrId: string,
  body: CreateReplyRequest,
  userId: string
): Promise<{ success: boolean; reply?: DiscussionComment; error?: string }> {
  if (!userId) {
    return { success: false, error: 'Unauthorized: Authentication required to post a reply.' };
  }

  const thread = forumThreads.find(t => t.slug === slugOrId || t.id === slugOrId);
  if (!thread) {
    return { success: false, error: 'Discussion not found.' };
  }

  // Server-side locked discussion check
  if (thread.isLocked) {
    return { success: false, error: 'This discussion is locked and no further replies can be added.' };
  }

  if (!body.content || !body.content.trim()) {
    return { success: false, error: 'Validation Error: Reply content cannot be empty.' };
  }

  // Rate Limiting (10s cooldown)
  const now = Date.now();
  const lastReply = userLastCreatedReply[userId] || 0;
  if (now - lastReply < 10_000) {
    const waitSec = Math.ceil((10_000 - (now - lastReply)) / 1000);
    return { success: false, error: `Rate limit: Please wait ${waitSec}s before posting another reply.` };
  }
  userLastCreatedReply[userId] = now;

  const nextPostNumber = (thread.comments?.length || 0) + 2;
  const safeContent = SecuritySanitizer.limitQuoteNesting(body.content.trim());

  const newComment: DiscussionComment = {
    id: `c-${Date.now()}`,
    postNumber: nextPostNumber,
    author: body.author,
    content: safeContent,
    createdAt: 'Just now',
    likes: 0,
    hasLiked: false,
    reactions: { like: [], love: [], helpful: [], great: [] },
    replyToPostNumber: body.replyToPostNumber,
    replyToAuthor: body.replyToAuthor,
    isAcceptedAnswer: false
  };

  if (!thread.comments) thread.comments = [];
  thread.comments.push(newComment);
  thread.commentsCount = thread.comments.length;
  thread.lastActivityAt = 'Just now';

  return { success: true, reply: newComment };
}

/**
 * Handle POST /api/discussions/posts/:postId/react
 */
export async function handleToggleReaction(
  threadId: string,
  postId: string,
  reactionType: ForumReactionType,
  userId: string
): Promise<{ success: boolean; reactions?: Record<ForumReactionType, string[]>; error?: string }> {
  if (!userId) {
    return { success: false, error: 'Unauthorized: Authentication required to react.' };
  }

  // Rate limit: max 10 reactions in 5 seconds
  const now = Date.now();
  if (!userReactionTimestamps[userId]) userReactionTimestamps[userId] = [];
  userReactionTimestamps[userId] = userReactionTimestamps[userId].filter(t => now - t < 5000);
  if (userReactionTimestamps[userId].length >= 10) {
    return { success: false, error: 'Reaction rate limit exceeded. Please slow down.' };
  }
  userReactionTimestamps[userId].push(now);

  const thread = forumThreads.find(t => t.id === threadId || t.slug === threadId);
  if (!thread) return { success: false, error: 'Thread not found' };

  let targetReactions: Record<ForumReactionType, string[]> | undefined;

  // Check if target is original post (#1) or reply
  if (postId === thread.id || postId === 'post-1' || postId === 'thread') {
    if (!thread.reactions) {
      thread.reactions = { like: [], love: [], helpful: [], great: [] };
    }
    targetReactions = thread.reactions;
  } else {
    const comment = thread.comments?.find(c => c.id === postId);
    if (!comment) return { success: false, error: 'Post not found' };
    if (!comment.reactions) {
      comment.reactions = { like: [], love: [], helpful: [], great: [] };
    }
    targetReactions = comment.reactions;
  }

  // One reaction per user per post: remove any other existing reaction
  const types: ForumReactionType[] = ['like', 'love', 'helpful', 'great'];
  const hasCurrentReaction = targetReactions[reactionType].includes(userId);

  // Clear user from all reaction buckets for this post
  types.forEach(t => {
    targetReactions![t] = targetReactions![t].filter(uid => uid !== userId);
  });

  // If user didn't already have this reaction, add it (toggle/switch)
  if (!hasCurrentReaction) {
    targetReactions[reactionType].push(userId);
  }

  return { success: true, reactions: targetReactions };
}

/**
 * Handle POST /api/discussions/posts/:postId/accept
 */
export async function handleAcceptAnswer(
  threadId: string,
  postId: string,
  userId: string,
  userRole: string
): Promise<{ success: boolean; isSolved?: boolean; acceptedPostId?: string; error?: string }> {
  if (!userId) {
    return { success: false, error: 'Unauthorized.' };
  }

  const thread = forumThreads.find(t => t.id === threadId || t.slug === threadId);
  if (!thread) return { success: false, error: 'Thread not found' };

  // Authorization: Only discussion author or moderator/admin can accept an answer
  const isAuthor = thread.author.id === userId;
  const isModerator = userRole === 'admin' || userRole === 'moderator';

  if (!isAuthor && !isModerator) {
    return { success: false, error: 'Forbidden: Only the thread author or a moderator can mark the accepted answer.' };
  }

  const comment = thread.comments?.find(c => c.id === postId);
  if (!comment) return { success: false, error: 'Post not found.' };

  // Toggle accepted state
  if (comment.isAcceptedAnswer) {
    comment.isAcceptedAnswer = false;
    thread.isSolved = false;
    thread.acceptedPostId = undefined;
  } else {
    // Clear any previous accepted answer in thread
    thread.comments?.forEach(c => { c.isAcceptedAnswer = false; });
    comment.isAcceptedAnswer = true;
    thread.isSolved = true;
    thread.acceptedPostId = postId;
  }

  return {
    success: true,
    isSolved: thread.isSolved,
    acceptedPostId: thread.acceptedPostId
  };
}

/**
 * Handle PATCH /api/discussions/:slug/moderation
 */
export async function handleModerationAction(
  slugOrId: string,
  actionPayload: ModerationActionRequest,
  userId: string,
  userRole: string
): Promise<{ success: boolean; thread?: DiscussionPost; error?: string }> {
  if (!userId || (userRole !== 'admin' && userRole !== 'moderator')) {
    return { success: false, error: 'Forbidden: Moderator privileges required.' };
  }

  const thread = forumThreads.find(t => t.slug === slugOrId || t.id === slugOrId);
  if (!thread) return { success: false, error: 'Thread not found' };

  switch (actionPayload.action) {
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
      forumThreads = forumThreads.filter(t => t.id !== thread.id);
      return { success: true };
    default:
      return { success: false, error: 'Invalid moderation action.' };
  }

  return { success: true, thread };
}

/**
 * Handle POST /api/discussions/:slug/watch & /bookmark
 */
export async function handleToggleWatch(
  slugOrId: string,
  userId: string
): Promise<{ success: boolean; isWatching?: boolean; error?: string }> {
  if (!userId) return { success: false, error: 'Unauthorized' };
  const thread = forumThreads.find(t => t.slug === slugOrId || t.id === slugOrId);
  if (!thread) return { success: false, error: 'Thread not found' };

  if (!thread.watchedByUserIds) thread.watchedByUserIds = [];
  const index = thread.watchedByUserIds.indexOf(userId);
  let isWatching = false;
  if (index > -1) {
    thread.watchedByUserIds.splice(index, 1);
  } else {
    thread.watchedByUserIds.push(userId);
    isWatching = true;
  }
  return { success: true, isWatching };
}

export async function handleToggleBookmark(
  slugOrId: string,
  userId: string
): Promise<{ success: boolean; isBookmarked?: boolean; error?: string }> {
  if (!userId) return { success: false, error: 'Unauthorized' };
  const thread = forumThreads.find(t => t.slug === slugOrId || t.id === slugOrId);
  if (!thread) return { success: false, error: 'Thread not found' };

  if (!thread.bookmarkedByUserIds) thread.bookmarkedByUserIds = [];
  const index = thread.bookmarkedByUserIds.indexOf(userId);
  let isBookmarked = false;
  if (index > -1) {
    thread.bookmarkedByUserIds.splice(index, 1);
  } else {
    thread.bookmarkedByUserIds.push(userId);
    isBookmarked = true;
  }
  return { success: true, isBookmarked };
}
