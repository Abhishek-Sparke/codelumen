import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeCodeSandbox, getProblemTestCases } from './serverlessRunner';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error_message: 'Method not allowed' });
  }

  if (!req.body?.user_id) {
    return res.status(401).json({ success: false, status: 'SYSTEM_ERROR', error_message: 'Unauthorized: user_id is required' });
  }

  try {
    const { problem_id = 'two-sum', language = 'javascript', code = '' } = req.body || {};
    const testCases = getProblemTestCases(problem_id, false);

    const result = executeCodeSandbox(code, language, testCases);
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return res.status(200).json({
      success: true,
      submission_id: submissionId,
      job_id: jobId,
      ...result
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      status: 'SYSTEM_ERROR',
      error_message: err.message || 'Submission error'
    });
  }
}
