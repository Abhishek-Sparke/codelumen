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
import { handleSparkAction } from './server/sparkController'
import {
  handleGetMetrics,
  handleGetUsers,
  handleUpdateUserRole,
  handleUpdateUserStatus,
  handleGetReports,
  handleResolveReport,
  handleGetDiscussionRules,
  handleSaveDiscussionRulesDraft,
  handlePublishDiscussionRules,
  handleRollbackDiscussionRules,
  handleGetProblems,
  handlePublishProblem,
  handleArchiveProblem,
  handleGetPlatformSettings,
  handleUpdatePlatformSettings,
  handleGetAuditLogs
} from './server/adminController'

function codesparkApiPlugin(): Plugin {
  return {
    name: 'codespark-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url || '/', 'http://localhost:5173');
        const pathname = parsedUrl.pathname;

        // Admin & Moderation APIs: /api/admin/*
        if (pathname.startsWith('/api/admin')) {
          res.setHeader('Content-Type', 'application/json');
          const actorRole = (req.headers['x-user-role'] as string) || parsedUrl.searchParams.get('role') || 'user';
          const actorId = (req.headers['x-user-id'] as string) || parsedUrl.searchParams.get('userId') || '';
          const actorUsername = (req.headers['x-user-username'] as string) || parsedUrl.searchParams.get('username') || '';

          if (req.method === 'GET') {
            if (pathname === '/api/admin/metrics') {
              const resObj = await handleGetMetrics(actorRole, actorId);
              res.statusCode = resObj.status;
              res.end(JSON.stringify(resObj.data));
              return;
            }
            if (pathname === '/api/admin/users') {
              const search = parsedUrl.searchParams.get('search') || undefined;
              const role = parsedUrl.searchParams.get('roleFilter') || undefined;
              const status = parsedUrl.searchParams.get('statusFilter') || undefined;
              const resObj = await handleGetUsers(actorRole, actorId, { search, role, status });
              res.statusCode = resObj.status;
              res.end(JSON.stringify(resObj.data));
              return;
            }
            if (pathname === '/api/admin/reports') {
              const status = parsedUrl.searchParams.get('status') || undefined;
              const priority = parsedUrl.searchParams.get('priority') || undefined;
              const resObj = await handleGetReports(actorRole, actorId, { status, priority });
              res.statusCode = resObj.status;
              res.end(JSON.stringify(resObj.data));
              return;
            }
            if (pathname === '/api/admin/rules') {
              const resObj = await handleGetDiscussionRules(actorRole, actorId);
              res.statusCode = resObj.status;
              res.end(JSON.stringify(resObj.data));
              return;
            }
            if (pathname === '/api/admin/problems') {
              const search = parsedUrl.searchParams.get('search') || undefined;
              const lifecycle = parsedUrl.searchParams.get('lifecycle') || undefined;
              const resObj = await handleGetProblems(actorRole, actorId, { search, lifecycle });
              res.statusCode = resObj.status;
              res.end(JSON.stringify(resObj.data));
              return;
            }
            if (pathname === '/api/admin/settings') {
              const resObj = await handleGetPlatformSettings(actorRole, actorId);
              res.statusCode = resObj.status;
              res.end(JSON.stringify(resObj.data));
              return;
            }
            if (pathname === '/api/admin/audit-logs') {
              const targetType = parsedUrl.searchParams.get('targetType') || undefined;
              const search = parsedUrl.searchParams.get('search') || undefined;
              const limit = parsedUrl.searchParams.get('limit') ? parseInt(parsedUrl.searchParams.get('limit')!, 10) : undefined;
              const resObj = await handleGetAuditLogs(actorRole, actorId, { targetType, search, limit });
              res.statusCode = resObj.status;
              res.end(JSON.stringify(resObj.data));
              return;
            }
          }

          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const role = body.actorRole || actorRole;
                const id = body.actorId || actorId;
                const username = body.actorUsername || actorUsername;

                if (pathname === '/api/admin/users/role') {
                  const resObj = await handleUpdateUserRole(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }
                if (pathname === '/api/admin/users/status') {
                  const resObj = await handleUpdateUserStatus(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }
                if (pathname === '/api/admin/reports/resolve') {
                  const resObj = await handleResolveReport(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }
                if (pathname === '/api/admin/rules/draft') {
                  const resObj = await handleSaveDiscussionRulesDraft(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }
                if (pathname === '/api/admin/rules/publish') {
                  const resObj = await handlePublishDiscussionRules(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }
                if (pathname === '/api/admin/rules/rollback') {
                  const resObj = await handleRollbackDiscussionRules(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }
                if (pathname === '/api/admin/problems/publish') {
                  const resObj = await handlePublishProblem(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }
                if (pathname === '/api/admin/problems/archive') {
                  const resObj = await handleArchiveProblem(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }
                if (pathname === '/api/admin/settings') {
                  const resObj = await handleUpdatePlatformSettings(role, id, username, body);
                  res.statusCode = resObj.status;
                  res.end(JSON.stringify(resObj.data));
                  return;
                }

                res.statusCode = 404;
                res.end(JSON.stringify({ success: false, error: 'Admin action endpoint not found' }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
              }
            });
            return;
          }
        }

        // Spark AI APIs
        if (pathname.startsWith('/api/spark')) {
          res.setHeader('Content-Type', 'application/json');
          if (req.method === 'POST' && pathname === '/api/spark/action') {
            let bodyStr = '';
            req.on('data', (chunk) => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const result = await handleSparkAction(body);
                res.statusCode = result.status;
                res.end(JSON.stringify(result.data));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({
                  success: false,
                  action: 'hint',
                  title: 'Internal Error',
                  summary: 'Failed to process Spark AI request.',
                  content: err?.message || 'Server error'
                }));
              }
            });
            return;
          }
        }

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
