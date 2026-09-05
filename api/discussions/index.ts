import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleGetCategories,
  handleGetDiscussions,
  handleGetDiscussionBySlug,
  handleCreateDiscussion,
  handleCreateReply,
  handleToggleReaction,
  handleAcceptAnswer,
  handleModerationAction,
  handleToggleWatch,
  handleToggleBookmark
} from '../../server/forumController';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action, slug, postId } = req.query;

  try {
    if (req.method === 'GET') {
      if (action === 'categories') {
        const result = await handleGetCategories();
        return res.status(200).json(result);
      }

      if (slug) {
        const userId = (req.query.userId as string) || undefined;
        const incrementView = req.query.view !== 'false';
        const result = await handleGetDiscussionBySlug(slug as string, userId, incrementView);
        return res.status(result.success ? 200 : 404).json(result);
      }

      const params = {
        category: (req.query.category as string) || undefined,
        filter: (req.query.filter as string) || undefined,
        search: (req.query.search as string) || undefined,
        tag: (req.query.tag as string) || undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        userId: (req.query.userId as string) || undefined
      };
      const result = await handleGetDiscussions(params);
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const userId = (req.headers['x-user-id'] as string) || req.body?.author?.id || req.body?.userId;

      if (action === 'create') {
        const result = await handleCreateDiscussion(req.body, userId);
        return res.status(result.success ? 201 : 400).json(result);
      }

      if (action === 'reply' && slug) {
        const result = await handleCreateReply(slug as string, req.body, userId);
        return res.status(result.success ? 201 : 400).json(result);
      }

      if (action === 'react' && postId) {
        const { threadId, reactionType } = req.body;
        const result = await handleToggleReaction(threadId, postId as string, reactionType, userId);
        return res.status(result.success ? 200 : 400).json(result);
      }

      if (action === 'accept' && postId) {
        const { threadId, userRole } = req.body;
        const result = await handleAcceptAnswer(threadId, postId as string, userId, userRole || 'user');
        return res.status(result.success ? 200 : (result.error?.includes('Forbidden') ? 403 : 400)).json(result);
      }

      if (action === 'watch' && slug) {
        const result = await handleToggleWatch(slug as string, userId);
        return res.status(result.success ? 200 : 400).json(result);
      }

      if (action === 'bookmark' && slug) {
        const result = await handleToggleBookmark(slug as string, userId);
        return res.status(result.success ? 200 : 400).json(result);
      }
    }

    if (req.method === 'PATCH' && action === 'moderation' && slug) {
      const userId = (req.headers['x-user-id'] as string) || req.body?.userId;
      const userRole = (req.headers['x-user-role'] as string) || req.body?.userRole || 'user';
      const result = await handleModerationAction(slug as string, req.body, userId, userRole);
      return res.status(result.success ? 200 : (result.error?.includes('Forbidden') ? 403 : 400)).json(result);
    }

    return res.status(404).json({ success: false, error: 'Endpoint not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}
