import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Return static events data
  const staticEvents = [
    {
      id: "1",
      title: "Sample Event 1",
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
    },
    {
      id: "2",
      title: "Sample Event 2",
      description: "Another sample event description",
      date: "2024-06-15",
      time: "19:00",
      location: "Los Angeles, CA",
      price: 75,
      tickets_sold: 0,
      images: [
        {
          id: "2",
          image_url: "/images/event2.jpg"
        }
      ]
    }
  ];

  return NextResponse.json(staticEvents);
}