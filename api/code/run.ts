import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeCodeSandbox, getProblemTestCases } from './serverlessRunner';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error_message: 'Method not allowed' });
  }

  try {
    const { problem_id = 'two-sum', language = 'javascript', code = '' } = req.body || {};
    const testCases = getProblemTestCases(problem_id, true);

    const result = executeCodeSandbox(code, language, testCases);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      status: 'SYSTEM_ERROR',
      error_message: err.message || 'Execution error'
    });
  }
}
