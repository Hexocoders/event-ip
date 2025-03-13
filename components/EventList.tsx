'use client';

import { useEffect, useState } from 'react';
import EventCard from './EventCard';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  tier: string;
  ticket_count?: number;
}

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A fantastic summer music festival with top artists',
    date: '2024-07-15',
    time: '14:00',
    location: 'Central Park',
    price: 50,
    tier: 'gold',
    ticket_count: 150
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    description: 'Annual technology conference with industry leaders',
    date: '2024-08-20',
    time: '09:00',
    location: 'Convention Center',
    price: 299,
    tier: 'platinum',
    ticket_count: 75
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    description: 'Explore the finest cuisines and wines',
    date: '2024-06-10',
    time: '11:00',
    location: 'City Hall',
    price: 25,
    tier: 'silver',
    ticket_count: 200
  }
];

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [weekEvents, setWeekEvents] = useState<Event[]>([]);
  const [hotRaves, setHotRaves] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const loadEvents = () => {
      setEvents(MOCK_EVENTS);

      // Filter events for this week
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      const weekEvents = MOCK_EVENTS.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= sevenDaysFromNow;
      });

      // Filter hot raves (events with more than 100 tickets)
      const hotRaves = MOCK_EVENTS.filter(event => 
        event.ticket_count && event.ticket_count >= 100
      );

      setWeekEvents(weekEvents);
      setHotRaves(hotRaves);
      setLoading(false);
    };

    loadEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Events of the Week */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Events of the Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weekEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              highlight="week"
            />
          ))}
        </div>
      </section>

      {/* Hot Raves */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Hot Raves 🔥</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotRaves.map(event => (
            <EventCard
              key={event.id}
              event={event}
              highlight="hot"
            />
          ))}
        </div>
      </section>

      {/* All Events */}
      <section>
        <h2 className="text-3xl font-bold mb-6">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      </section>
    </div>
  );
} 