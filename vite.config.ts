import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { handleCodeRun, handleCodeSubmit } from './server/apiController'

function codesparkExecutionPlugin(): Plugin {
  return {
    name: 'codespark-execution-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (req.method === 'POST' && (url === '/api/code/run' || url === '/api/code/submit')) {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              res.setHeader('Content-Type', 'application/json');
              if (url === '/api/code/run') {
                const result = await handleCodeRun(body);
                res.statusCode = 200;
                res.end(JSON.stringify(result));
              } else if (url === '/api/code/submit') {
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
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), codesparkExecutionPlugin()],
})
