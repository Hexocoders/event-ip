import { NextResponse, NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(_request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('Authentication failed: No user found');
      return NextResponse.json(
        { error: 'Please log in to view your events' },
        { status: 401 }
      );
    }

    console.log('Authenticated user:', user.id);

    // First, fetch the events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select(`
        *,
        tickets(count)
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (eventsError) {
      throw eventsError;
    }

    // Then, fetch images for all events
    const eventIds = events.map(event => event.id);
    let images: { event_id: string; id: string; image_url: string }[] = [];
    
    if (eventIds.length > 0) {
      const { data: eventImages, error: imagesError } = await supabase
        .from('event_images')
        .select('event_id, id, image_url')
        .in('event_id', eventIds);

      if (!imagesError && eventImages) {
        images = eventImages;
      }
    }

    // Combine events with their images
    const processedEvents = events.map(event => ({
      ...event,
      tickets_sold: event.tickets?.[0]?.count || 0,
      images: images.filter(img => img.event_id === event.id).map(img => ({
        id: img.id,
        image_url: img.image_url
      }))
    }));

    console.log('Events fetched:', processedEvents.length);
    return NextResponse.json(processedEvents);
  } catch (error) {
    console.error('Error in /api/events/my-events:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch events' },
      { status: 500 }
    );
  }
}