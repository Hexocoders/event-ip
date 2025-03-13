'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiHeart, FiCalendar, FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  type: string;
  tier: string;
  capacity: string;
  logistics_phone: string;
  images: { file: File; url: string }[];
}

export default function ReviewEvent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [publishDate, setPublishDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [publishTime, setPublishTime] = useState('06:00');
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = () => {
      try {
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        const event = storedEvents.find((e: EventData) => e.id === params.id);
        
        if (event) {
          setEventData(event);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [params.id]);

  const handlePublish = () => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const updatedEvents = storedEvents.map((event: EventData) => {
        if (event.id === params.id) {
          return {
            ...event,
            publishDate: isScheduleEnabled ? publishDate : null,
            publishTime: isScheduleEnabled ? publishTime : null,
            status: 'published'
          };
        }
        return event;
      });
      
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      toast.success('Event published successfully!');
      router.push(`/events/${params.id}/thank-you`);
    } catch (error) {
      console.error('Error publishing event:', error);
      toast.error('Failed to publish event');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!eventData) {
    return <div className="flex items-center justify-center min-h-screen">Event not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Event Information */}
        <div className="col-span-1 space-y-6">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              Event information
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Last update</p>
              <p className="font-medium">
                {format(new Date(), 'EEEE, MMMM dd | hh:mm a')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">Draft</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">EVENT INFORMATION</h2>
            <div className="space-y-2">
              <div className="flex items-center text-green-500">
                <span className="mr-2">✓</span>
                <span>Upload cover</span>
              </div>
              <div className="flex items-center text-green-500">
                <span className="mr-2">✓</span>
                <span>General information</span>
              </div>
              <div className="flex items-center text-green-500">
                <span className="mr-2">✓</span>
                <span>Location and time</span>
              </div>
              <div className="flex items-center text-green-500">
                <span className="mr-2">✓</span>
                <span>Ticket</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">PUBLISH EVENT</h2>
            <button
              onClick={handlePublish}
              className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600"
            >
              Review and Publish
            </button>
          </div>
        </div>

        {/* Center Column - Preview */}
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-6">Review</h2>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {eventData.images && eventData.images[0] && (
              <div className="relative h-64 w-full">
                <img
                  src={eventData.images[0].url}
                  alt={eventData.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white">
                  <FiHeart className="text-gray-600" />
                </button>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    New event
                  </span>
                  <h1 className="text-2xl font-bold mt-2">{eventData.title}</h1>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">From</p>
                  <p className="text-xl font-bold">${eventData.price}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>
                    {format(new Date(eventData.date), 'EEEE, MMMM dd | ')}
                    {eventData.time}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>{eventData.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Publish Schedule */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Publish schedule</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isScheduleEnabled}
                  onChange={(e) => setIsScheduleEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
            
            <p className="text-gray-600 mb-4">
              Set the publishing time to ensure that your event appears on the website at the designated time
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={!isScheduleEnabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Time
                </label>
                <input
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={!isScheduleEnabled}
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="mt-8">
            <button className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-md">
              <span className="font-medium">Advanced settings</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Save draft
            </button>
            <button
              onClick={handlePublish}
              className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 