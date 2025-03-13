'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  tier?: 'silver' | 'gold' | 'platinum';
  image: string;
}

interface EventCardProps {
  event?: Event;
  highlight?: 'week' | 'hot';
}

const DEFAULT_IMAGE = '/images/event-default.jpg';

// Define tier background colors instead of images
const TIER_COLORS = {
  silver: 'bg-gradient-to-r from-gray-400 to-gray-300',
  gold: 'bg-gradient-to-r from-yellow-400 to-yellow-300',
  platinum: 'bg-gradient-to-r from-gray-600 to-gray-500',
};

export default function EventCard({ event, highlight }: EventCardProps) {
  const [imageError, setImageError] = useState(false);

  // If no event is provided, return null or a placeholder
  if (!event) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid time';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
      highlight === 'week' ? 'border-2 border-blue-500' :
      highlight === 'hot' ? 'border-2 border-red-500' : ''
    }`}>
      <div className="relative h-48">
        {!imageError ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            onError={() => setImageError(true)}
            priority
            className="transition-opacity duration-300 hover:opacity-90"
          />
        ) : (
          <div className={`w-full h-full ${event.tier ? TIER_COLORS[event.tier] : 'bg-gray-200'} flex items-center justify-center`}>
            <span className="text-white text-lg font-bold">{event.title}</span>
          </div>
        )}
        {highlight && (
          <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-sm font-bold ${
            highlight === 'week' ? 'bg-blue-500' : 'bg-red-500'
          }`}>
            {highlight === 'week' ? 'This Week' : 'Hot 🔥'}
          </div>
        )}
        {event.tier && (
          <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full text-white text-sm font-bold bg-black bg-opacity-50 backdrop-blur-sm capitalize">
            {event.tier} Tier
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold truncate">{event.title}</h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <FaCalendar className="mr-2" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2" />
            {formatTime(event.time)}
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">
              ${event.price}
            </span>
            {event.tier && (
              <span className="ml-2 text-sm text-gray-500 capitalize">
                {event.tier} tier
              </span>
            )}
          </div>
          
          <button
            className="px-3 py-1 rounded text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            onClick={() => window.location.href = `/events/${event.id}/tickets`}
          >
            Buy Tickets
          </button>
        </div>
      </div>
    </div>
  );
} 