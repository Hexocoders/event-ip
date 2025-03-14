'use client';

import { FiCalendar, FiMapPin } from 'react-icons/fi';
import Image from 'next/image';

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
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          width={400}
          height={300}
        />
        {event.tier && (
          <div className="absolute right-2 top-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
              ${event.tier === 'platinum' ? 'bg-purple-100 text-purple-800' :
                event.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'}`}>
              {event.tier}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{event.title}</h3>
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <FiCalendar className="mr-2" />
            <span>{new Date(event.date).toLocaleDateString()} | {event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiMapPin className="mr-2" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">${event.price}</span>
        </div>
      </div>
    </div>
  );
} 