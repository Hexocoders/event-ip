import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface EventImage {
  id: string;
  image_url: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Fetch the event with its images
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        tickets(count),
        event_images(id, image_url)
      `)
      .eq('id', params.id)
      .single();

    if (eventError) {
      throw eventError;
    }

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Process the event data
    const processedEvent = {
      ...event,
      tickets_sold: event.tickets?.[0]?.count || 0,
      images: event.event_images?.map((img: EventImage) => ({
        id: img.id,
        image_url: img.image_url
      })) || []
    };

    return NextResponse.json(processedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch event' },
      { status: 500 }
    );
  }
} 