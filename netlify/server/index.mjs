import { and, desc, eq, gt } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/netlify-db';
import { submissions } from '../../db/schema.ts';

const db = drizzle({ schema: { submissions } });
const messageKinds = new Set(['feedback', 'suggestion', 'complaint']);
const allowedRoutes = new Set(['/api/reviews', '/api/feedback']);

function json(body, status = 200, headers) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

async function readSubmission(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json') || !request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = '';
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }
  try { return JSON.parse(body + decoder.decode()); } catch { return null; }
}

export default async function handler(request) {
  const url = new URL(request.url);
  if (!allowedRoutes.has(url.pathname)) return json({ error: 'Not found.' }, 404);
  const isReview = url.pathname === '/api/reviews';

  try {
    if (isReview && request.method === 'GET') {
      const reviews = await db.select({ name: submissions.name, message: submissions.message, createdAt: submissions.createdAt })
        .from(submissions).where(and(eq(submissions.kind, 'review'), eq(submissions.approved, true)))
        .orderBy(desc(submissions.createdAt)).limit(40);
      return json({ reviews });
    }

    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { Allow: isReview ? 'GET, POST' : 'POST' });
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) return json({ error: 'Please submit from the website.' }, 403);

    const data = await readSubmission(request);
    const kind = isReview ? 'review' : data?.kind;
    const message = typeof data?.message === 'string' ? data.message.trim() : '';
    const name = typeof data?.name === 'string' ? data.name.trim() : '';
    if (data?.website) return json({ ok: true }, 201);
    if ((!isReview && !messageKinds.has(kind)) || message.length < 5 || message.length > 1200 || name.length > 48) {
      return json({ error: 'Write a message of 5–1,200 characters and use a nickname under 49 characters.' }, 400);
    }

    const author = name || 'Little Explorer';
    const [recent] = await db.select({ id: submissions.id }).from(submissions).where(and(
      eq(submissions.kind, kind), eq(submissions.message, message), eq(submissions.name, author),
      gt(submissions.createdAt, new Date(Date.now() - 60_000)),
    )).limit(1);
    if (!recent) await db.insert(submissions).values({ kind, name: author, message });
    return json({ ok: true }, 201);
  } catch {
    return json({ error: 'We couldn’t reach the message service. Please try again in a moment.' }, 503);
  }
}
