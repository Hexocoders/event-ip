'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter, FiCalendar, FiMapPin, FiEdit, FiTrash2 } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'past' | 'draft';
  capacity: string;
  images: { file: File; url: string }[];
  tickets_sold: number;
}

export default function MyEventsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'past' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = () => {
      try {
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        
        // Process events to determine their status
        const processedEvents = storedEvents.map((event: Event) => {
          const eventDate = new Date(event.date);
          const today = new Date();
          let status: 'upcoming' | 'past' | 'draft';

          if (eventDate < today) {
            status = 'past';
          } else {
            status = 'upcoming';
          }

          return {
            ...event,
            status,
            tickets_sold: event.tickets_sold || 0
          };
        });

        setEvents(processedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (selectedStatus !== 'all' && event.status !== selectedStatus) return false;
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/events/${eventId}/edit`);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const updatedEvents = events.filter(event => event.id !== eventId);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-64 pt-16">
          <div className="p-6 max-w-7xl mx-auto flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Events</h1>
            <button 
              onClick={() => router.push('/events/create')}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Create New Event
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setSelectedStatus('upcoming')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === 'upcoming'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setSelectedStatus('past')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === 'past'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Past
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiFilter />
                </button>
              </div>
            </div>

            {/* Events List */}
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No events found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                        {event.images && event.images[0] ? (
                          <Image
                            src={event.images[0].url}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiCalendar className="mr-2" />
                          <span>{formatDate(event.date)} at {event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiMapPin className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Tickets Sold</div>
                        <div className="font-semibold">{event.tickets_sold}/{event.capacity}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditEvent(event.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 