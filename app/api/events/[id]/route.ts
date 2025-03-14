import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Return static event data
  const staticEvent = {
    id: context.params.id,
    title: "Sample Event",
    description: "This is a sample event description",
    date: "2024-06-01",
    time: "18:00",
    location: "New York, NY",
    price: 50,
    tickets_sold: 0,
    images: [
      {
        id: "1",
        image_url: "/images/event1.jpg"
      }
    ]
  };

  return NextResponse.json(staticEvent);
}
