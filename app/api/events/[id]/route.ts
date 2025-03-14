import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use params.id to fetch event data
    // ... existing code ...
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch event' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 