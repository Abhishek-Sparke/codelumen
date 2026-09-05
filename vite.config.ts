import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { handleCodeRun, handleCodeSubmit } from './server/apiController'
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
} from './server/forumController'

function codesparkApiPlugin(): Plugin {
  return {
    name: 'codespark-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url || '/', 'http://localhost:5173');
        const pathname = parsedUrl.pathname;

        // Code Execution APIs
        if (req.method === 'POST' && (pathname === '/api/code/run' || pathname === '/api/code/submit')) {
          let bodyStr = '';
          req.on('data', (chunk) => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              res.setHeader('Content-Type', 'application/json');
              if (pathname === '/api/code/run') {
                const result = await handleCodeRun(body);
                res.statusCode = 200;
                res.end(JSON.stringify(result));
              } else if (pathname === '/api/code/submit') {
                if (!body.user_id) {
                  res.statusCode = 401;
                  res.end(JSON.stringify({ success: false, status: 'SYSTEM_ERROR', error_message: 'Unauthorized: user_id is required' }));
                  return;
                }
                const result = await handleCodeSubmit(body);
                res.statusCode = 200;
                res.end(JSON.stringify(result));
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, status: 'SYSTEM_ERROR', error_message: err?.message || 'Server error' }));
            }
          });
          return;
        }

        // Discussion Forum APIs
        if (pathname.startsWith('/api/discussions')) {
          res.setHeader('Content-Type', 'application/json');

          if (req.method === 'GET') {
            if (pathname === '/api/discussions/categories') {
              const result = await handleGetCategories();
              res.statusCode = 200;
              res.end(JSON.stringify(result));
              return;
            }

            if (pathname === '/api/discussions') {
              const params = {
                category: parsedUrl.searchParams.get('category') || undefined,
                filter: parsedUrl.searchParams.get('filter') || undefined,
                search: parsedUrl.searchParams.get('search') || undefined,
                tag: parsedUrl.searchParams.get('tag') || undefined,
                page: parsedUrl.searchParams.get('page') ? parseInt(parsedUrl.searchParams.get('page')!) : 1,
                limit: parsedUrl.searchParams.get('limit') ? parseInt(parsedUrl.searchParams.get('limit')!) : 20,
                userId: parsedUrl.searchParams.get('userId') || undefined
              };
              const result = await handleGetDiscussions(params);
              res.statusCode = 200;
              res.end(JSON.stringify(result));
              return;
            }

            // GET /api/discussions/:slug
            const slug = pathname.replace('/api/discussions/', '').split('/')[0];
            const userId = parsedUrl.searchParams.get('userId') || undefined;
            const incrementView = parsedUrl.searchParams.get('view') !== 'false';
            const result = await handleGetDiscussionBySlug(slug, userId, incrementView);
            res.statusCode = result.success ? 200 : 404;
            res.end(JSON.stringify(result));
            return;
          }

          // POST / PATCH APIs
          let bodyStr = '';
          req.on('data', (chunk) => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');

              // POST /api/discussions
              if (req.method === 'POST' && pathname === '/api/discussions') {
                const userId = req.headers['x-user-id'] as string || body.author?.id;
                const result = await handleCreateDiscussion(body, userId);
                res.statusCode = result.success ? 201 : 400;
                res.end(JSON.stringify(result));
                return;
              }

              // POST /api/discussions/:slug/posts
              if (req.method === 'POST' && pathname.endsWith('/posts') && !pathname.includes('/posts/')) {
                const parts = pathname.split('/');
                const slug = parts[3];
                const userId = req.headers['x-user-id'] as string || body.author?.id;
                const result = await handleCreateReply(slug, body, userId);
                res.statusCode = result.success ? 201 : (result.error?.includes('locked') ? 403 : 400);
                res.end(JSON.stringify(result));
                return;
              }

              // POST /api/discussions/posts/:postId/react
              if (req.method === 'POST' && pathname.includes('/posts/') && pathname.endsWith('/react')) {
                const parts = pathname.split('/');
                const postId = parts[4];
                const { threadId, reactionType } = body;
                const userId = req.headers['x-user-id'] as string || body.userId;
                const result = await handleToggleReaction(threadId, postId, reactionType, userId);
                res.statusCode = result.success ? 200 : 400;
                res.end(JSON.stringify(result));
                return;
              }

              // POST /api/discussions/posts/:postId/accept
              if (req.method === 'POST' && pathname.includes('/posts/') && pathname.endsWith('/accept')) {
                const parts = pathname.split('/');
                const postId = parts[4];
                const { threadId, userRole } = body;
                const userId = req.headers['x-user-id'] as string || body.userId;
                const result = await handleAcceptAnswer(threadId, postId, userId, userRole || 'user');
                res.statusCode = result.success ? 200 : (result.error?.includes('Forbidden') ? 403 : 400);
                res.end(JSON.stringify(result));
                return;
              }

              // POST /api/discussions/:slug/watch
              if (req.method === 'POST' && pathname.endsWith('/watch')) {
                const parts = pathname.split('/');
                const slug = parts[3];
                const userId = req.headers['x-user-id'] as string || body.userId;
                const result = await handleToggleWatch(slug, userId);
                res.statusCode = result.success ? 200 : 400;
                res.end(JSON.stringify(result));
                return;
              }

              // POST /api/discussions/:slug/bookmark
              if (req.method === 'POST' && pathname.endsWith('/bookmark')) {
                const parts = pathname.split('/');
                const slug = parts[3];
                const userId = req.headers['x-user-id'] as string || body.userId;
                const result = await handleToggleBookmark(slug, userId);
                res.statusCode = result.success ? 200 : 400;
                res.end(JSON.stringify(result));
                return;
              }

              // PATCH /api/discussions/:slug/moderation
              if (req.method === 'PATCH' && pathname.endsWith('/moderation')) {
                const parts = pathname.split('/');
                const slug = parts[3];
                const userId = req.headers['x-user-id'] as string || body.userId;
                const userRole = req.headers['x-user-role'] as string || body.userRole || 'user';
                const result = await handleModerationAction(slug, body, userId, userRole);
                res.statusCode = result.success ? 200 : (result.error?.includes('Forbidden') ? 403 : 400);
                res.end(JSON.stringify(result));
                return;
              }

              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), codesparkApiPlugin()],
})
