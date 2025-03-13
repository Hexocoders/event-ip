'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheck, FiShare2, FiEdit } from 'react-icons/fi';
import confetti from 'canvas-confetti';

interface EventData {
  id: string;
  title: string;
  status?: string;
}

export default function ThankYouPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Fetch event data from localStorage
    const fetchEventData = () => {
      try {
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        const event = storedEvents.find((e: EventData) => e.id === params.id);
        
        if (event) {
          setEventData(event);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEventData();
  }, [params.id]);

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/events/${params.id}`;
      if (navigator.share) {
        await navigator.share({
          title: eventData?.title || 'Check out this event!',
          text: 'I just created a new event. Check it out!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Event link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event Created Successfully!
          </h1>
          <p className="text-gray-600">
            Your event &quot;{eventData?.title}&quot; has been created and saved as a draft
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push(`/events/review/${params.id}`)}
            className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center justify-center"
          >
            <FiEdit className="w-5 h-5 mr-2" />
            Review and Publish
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiShare2 className="w-5 h-5 mr-2" />
            Share draft
          </button>

          <button
            onClick={() => router.push('/my-events')}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            View all events
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Note: Your event is currently saved as a draft. Review and publish it to make it visible to others.
        </div>
      </div>
    </div>
  );
} 