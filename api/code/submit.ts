import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCodeSubmit } from '../../server/apiController';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error_message: 'Method not allowed' });
  }

  if (!req.body?.user_id) {
    return res.status(401).json({ success: false, status: 'SYSTEM_ERROR', error_message: 'Unauthorized: user_id is required' });
  }

  try {
    const result = await handleCodeSubmit(req.body);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      status: 'SYSTEM_ERROR',
      error_message: err.message || 'Submission error'
    });
  }
}
