import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCodeRun } from '../../server/apiController';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error_message: 'Method not allowed' });
  }

  try {
    const result = await handleCodeRun(req.body);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      status: 'SYSTEM_ERROR',
      error_message: err.message || 'Execution error'
    });
  }
}
