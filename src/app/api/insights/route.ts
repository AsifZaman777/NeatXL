import { NextRequest, NextResponse } from 'next/server';

// Proxy route to bypass browser CORS when calling the external LLM insights endpoint
// Accepts multipart/form-data with a 'file' field (CSV) and forwards it.

export const runtime = 'edge'; // fast streaming capable; switch to 'nodejs' if libs needed

const TARGET_URL = 'http://159.132.10.51:8000/insights/file';

export async function POST(req: NextRequest) {
  try {
    // Clone form-data from incoming request
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data with file field' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file field' }, { status: 400 });
    }

    // Forward to target endpoint
    const forwardForm = new FormData();
    forwardForm.append('file', file, file.name || 'dataset.csv');

    const upstream = await fetch(TARGET_URL, {
      method: 'POST',
      body: forwardForm,
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Upstream error', status: upstream.status, body: text }, { status: 502 });
    }

    // Try to detect JSON
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch {
      // Return raw text
      return new NextResponse(text, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Proxy failure' }, { status: 500 });
  }
}
