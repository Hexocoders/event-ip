import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Event, ApiResponse } from '@/types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      const response: ApiResponse<null> = {
        error: 'Event not found',
        status: 404
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Event> = {
      data: event,
      status: 200
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
} 