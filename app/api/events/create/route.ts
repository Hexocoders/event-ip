import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Event, ApiResponse } from '@/types';

interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  is_private: boolean;
}

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      const response: ApiResponse<null> = {
        error: 'Unauthorized',
        status: 401
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body: CreateEventRequest = await req.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'location'];
    for (const field of requiredFields) {
      if (!body[field as keyof CreateEventRequest]) {
        const response: ApiResponse<null> = {
          error: `Missing required field: ${field}`,
          status: 400
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    // Create the event
    const { data: event, error: createError } = await supabase
      .from('events')
      .insert({
        ...body,
        created_by: user.id
      })
      .select()
      .single();

    if (createError) {
      const response: ApiResponse<null> = {
        error: 'Failed to create event',
        status: 500
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse<Event> = {
      data: event,
      status: 201
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}