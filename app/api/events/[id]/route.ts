import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch event details with images
    const eventResults = await db.query(
      `SELECT e.*, ei.id as image_id, ei.image_url
       FROM events e
       LEFT JOIN event_images ei ON e.id = ei.event_id
       WHERE e.id = ?`,
      [params.id]
    ) as any[];

    if (!eventResults || eventResults.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Process results to combine event data with images
    const event = {
      ...eventResults[0],
      images: eventResults
        .filter(row => row.image_url)
        .map(row => ({
          id: row.image_id,
          image_url: row.image_url
        }))
    };

    // Remove duplicate fields from the main event object
    delete event.image_id;
    delete event.image_url;

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event details' },
      { status: 500 }
    );
  }
} 