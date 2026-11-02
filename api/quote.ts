import { quoteSchema } from '../src/lib/quoteSchema.js';

type Req = { method?: string; body?: unknown };
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => Res;
  setHeader: (name: string, value: string) => Res;
};

/**
 * Vercel serverless function: validates the quote form and (for now) logs it.
 * TODO: send via Resend using process.env.RESEND_API_KEY to the client's inbox.
 */
export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body;
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) });
  }
  console.log('[quote]', JSON.stringify(parsed.data));
  return res.status(200).json({ ok: true });
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
