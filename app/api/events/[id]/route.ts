import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Event, ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Event ID is required', status: 400 } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        event_images (
          id,
          image_url
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Event not found', status: 404 } as ApiResponse<null>,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: event, status: 200 } as ApiResponse<Event>,
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      { error: errorMessage, status: 500 } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
