import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    // Verify user authentication
    const user = await auth();
    if (!user) {
      console.log('Authentication failed: No user found');
      return NextResponse.json(
        { error: 'Please log in to view your events' },
        { status: 401 }
      );
    }

    console.log('Authenticated user:', user.id);

    // First, fetch the events
    const events = await db.query(
      `SELECT 
        e.*,
        COUNT(DISTINCT t.id) as tickets_sold
       FROM events e
       LEFT JOIN tickets t ON e.id = t.event_id
       WHERE e.user_id = ?
       GROUP BY e.id
       ORDER BY e.date DESC`,
      [user.id]
    ) as any[];

    // Then, fetch images for all events
    const eventIds = events.map(event => event.id);
    let images = [];
    
    if (eventIds.length > 0) {
      images = await db.query(
        `SELECT event_id, id, image_url
         FROM event_images
         WHERE event_id IN (?)`,
        [eventIds]
      ) as any[];
    }

    // Combine events with their images
    const processedEvents = events.map(event => ({
      ...event,
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