'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiHeart, FiCalendar, FiMapPin, FiShare2, FiPhone } from 'react-icons/fi';
import { format } from 'date-fns';
import Image from 'next/image';

interface EventImage {
  id: number;
  image_url: string;
}

interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  type: string;
  tier: string;
  capacity: number;
  logistics_phone: string;
  images: EventImage[];
}

export default function EventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        const data = await response.json();
        console.log('Fetched event data:', data);
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [params.id]);

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: eventData?.title || 'Check out this event!',
          text: 'Check out this amazing event!',
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
        <p className="text-gray-600 mb-8">{error || 'This event does not exist or has been removed.'}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Event Images and Description */}
        <div className="md:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              {eventData.images && eventData.images.length > 0 ? (
                <div className="relative h-96 w-full">
                  <Image
                    src={eventData.images[selectedImage].image_url}
                    alt={eventData.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
                    priority
                  />
                  <button
                    onClick={handleShare}
                    className="absolute top-4 right-4 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg z-10"
                  >
                    <FiShare2 className="text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {eventData.images && eventData.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {eventData.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-pink-500' : ''
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={`${eventData.title} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 10vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Event Description */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About this event</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{eventData.description}</p>
          </div>
        </div>

        {/* Right Column - Event Details and Actions */}
        <div className="space-y-6">
          {/* Event Header */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full mb-2">
                {eventData.type.charAt(0).toUpperCase() + eventData.type.slice(1)} Event
              </span>
              <h1 className="text-2xl font-bold">{eventData.title}</h1>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2" />
                <span>
                  {format(new Date(eventData.date), 'EEEE, MMMM dd, yyyy')}
                  <br />
                  {eventData.time}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <FiMapPin className="mr-2" />
                <span>{eventData.location}</span>
              </div>

              {eventData.logistics_phone && (
                <div className="flex items-center text-gray-600">
                  <FiPhone className="mr-2" />
                  <span>{eventData.logistics_phone}</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Price</span>
                <span className="text-2xl font-bold">${eventData.price}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Capacity</span>
                <span>{eventData.capacity} people</span>
              </div>

              <button className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 mb-2">
                Get Tickets
              </button>
              <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                <FiHeart className="mr-2" />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 