import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ... existing code ...
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch event' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 