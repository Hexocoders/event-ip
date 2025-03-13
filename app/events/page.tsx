'use client';

import { useState } from 'react';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  isNew?: boolean;
  isFree?: boolean;
}

const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Rock Revolt: Power and Passion Unite',
    date: '2024-02-20',
    time: '20:00',
    location: 'New York, NY',
    price: 50,
    isNew: true
  },
  {
    id: '2',
    title: 'Rock Fest Extravaganza',
    date: '2024-12-17',
    time: '08:00',
    location: 'New York, NY',
    price: 80,
    isNew: true
  },
  {
    id: '3',
    title: 'A Legendary Gathering of Rock Icons',
    date: '2024-06-23',
    time: '21:00',
    location: 'New York, NY',
    price: 0,
    isFree: true
  },
  {
    id: '4',
    title: 'Classic Rock Hits',
    date: '2024-06-05',
    time: '20:00',
    location: 'New York, NY',
    price: 100
  }
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const formatDate = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr + 'T' + timeStr);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const dayNum = date.getDate();
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
    return `${day}, ${month} ${dayNum} | ${time}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Event</h1>
      
      {/* Search Bar */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rock"
            className="w-full p-3 rounded-lg bg-gray-100"
          />
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="New York, NY"
            className="w-full p-3 rounded-lg bg-gray-100"
          />
        </div>
        <button className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Search
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filters */}
        <div className="w-64">
          <div className="mb-6">
            <h2 className="font-medium mb-4">Filter</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="space-y-2">
                  {['All', 'Trending', 'Upcoming', 'Music', 'Sport', 'Exhibition', 'Business', 'Photography'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="mr-2 accent-pink-500"
                      />
                      <span className={`text-sm ${selectedCategory === category ? 'text-pink-500' : ''}`}>
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
                <button className="text-pink-500 text-sm mt-2">Show more</button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Pricing</h3>
                <div className="space-y-2">
                  {['Free', 'Paid'].map((price) => (
                    <label key={price} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPricing.includes(price)}
                        onChange={() => {
                          if (selectedPricing.includes(price)) {
                            setSelectedPricing(selectedPricing.filter(p => p !== price));
                          } else {
                            setSelectedPricing([...selectedPricing, price]);
                          }
                        }}
                        className="mr-2 accent-pink-500"
                      />
                      <span className="text-sm">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Type</h3>
                <div className="space-y-2">
                  {['Online', 'Offline - Indoor', 'Offline - Outdoor'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedType.includes(type)}
                        onChange={() => {
                          if (selectedType.includes(type)) {
                            setSelectedType(selectedType.filter(t => t !== type));
                          } else {
                            setSelectedType([...selectedType, type]);
                          }
                        }}
                        className="mr-2 accent-pink-500"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Language</h3>
                <div className="space-y-2">
                  {['English', 'German', 'French', 'Spanish'].map((language) => (
                    <label key={language} className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        checked={selectedLanguage === language}
                        onChange={() => setSelectedLanguage(language)}
                        className="mr-2 accent-pink-500"
                      />
                      <span className={`text-sm ${selectedLanguage === language ? 'text-pink-500' : ''}`}>
                        {language}
                      </span>
                    </label>
                  ))}
                </div>
                <button className="text-pink-500 text-sm mt-2">Show more</button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Clear all
            </button>
            <button className="flex-1 px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">
              Apply
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-6">{EVENTS.length} results</p>
          <div className="space-y-6">
            {EVENTS.map((event) => (
              <div key={event.id} className="flex gap-6 bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="w-72 h-48 bg-gray-200"></div>
                <div className="flex-1 py-4 pr-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {event.isFree ? (
                          <span className="text-sm text-green-600">Free Ticket</span>
                        ) : (
                          <span className="text-sm text-pink-500">From ${event.price}</span>
                        )}
                        {event.isNew && (
                          <span className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded">New Event</span>
                        )}
                      </div>
                      <h3 className="text-xl font-medium">{event.title}</h3>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-pink-500">
                      <FaHeart />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      <span>{formatDate(event.date, event.time)}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 px-6 py-3 text-pink-500 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
            View more
          </button>
        </div>
      </div>
    </div>
  );
} 