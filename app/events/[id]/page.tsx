import { FiCalendar, FiMapPin, FiPhone } from 'react-icons/fi';
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

async function getEventData(eventId: string): Promise<EventData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function EventPage({ params }: { params: { id: string } }) {
  const eventData = await getEventData(params.id);

  if (!eventData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
        <p className="text-gray-600 mb-8">This event does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            {eventData.images.length > 0 ? (
              <Image
                src={eventData.images[0].image_url}
                alt={eventData.title}
                width={800}
                height={600}
                className="object-cover w-full h-96"
              />
            ) : (
              <div className="h-96 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About this event</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{eventData.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold">{eventData.title}</h1>
            <div className="space-y-4 mt-4">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2" />
                <span>
                  {format(new Date(eventData.date), 'EEEE, MMMM dd, yyyy')}<br />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
