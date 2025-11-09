import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { baseUrl, token } = await req.json();
    if (typeof baseUrl !== 'string' || typeof token !== 'string') {
      return new Response('Invalid request', { status: 400 });
    }

    const url = new URL('/api/v1/users/self/assignments', baseUrl);
    url.searchParams.set('include[]', 'submission');
    url.searchParams.set('order_by', 'due_at');
    url.searchParams.set('bucket', 'upcoming');
    url.searchParams.set('per_page', '50');

    const canvasRes = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      // Next.js runtime fetch options
      cache: 'no-store',
    });

    if (!canvasRes.ok) {
      const text = await canvasRes.text();
      return new Response(`Canvas error: ${canvasRes.status} ${text}`, { status: 502 });
    }

    const assignments = await canvasRes.json();
    return Response.json({ assignments });
  } catch (e: any) {
    return new Response(e?.message || 'Server error', { status: 500 });
  }
}
