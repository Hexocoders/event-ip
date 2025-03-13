'use client';

import { useState } from 'react';
import { FiSearch, FiCalendar, FiMapPin } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
}

const TOP_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Country Legends',
    date: '2024-09-13',
    time: '08:30',
    location: 'New York, NY',
    price: 50,
    image: '/images/country-legends.jpg'
  },
  {
    id: '2',
    title: 'Classical Serenade',
    date: '2024-06-06',
    time: '06:22',
    location: 'New York, NY',
    price: 60,
    image: '/images/classical-serenade.jpg'
  },
  {
    id: '3',
    title: 'Electric Symphony',
    date: '2024-06-16',
    time: '17:00',
    location: 'New York, NY',
    price: 120,
    image: '/images/electric-symphony.jpg'
  }
];

const CATEGORIES = [
  'All',
  'Music',
  'Sport',
  'Exhibition',
  'Business',
  'Photography'
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const formatDate = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr + 'T' + timeStr);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const dayNum = date.getDate();
    return `${day}, ${month} ${dayNum} | ${timeStr} ${parseInt(timeStr) >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-gray-900/50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            <span className="block mb-2 text-gray-300 font-normal">Discover Unforgettable Experience at</span>
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Spectacular Events
            </span>
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-12">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search events, venues, or artists"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 backdrop-blur-sm transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top 3 Trending Events */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">
            Top <span className="text-pink-500">3</span> trending events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_EVENTS.map((event) => (
              <div key={event.id} className="relative group">
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <button className="absolute top-4 right-4 z-20 text-white hover:text-pink-500">
                    <FaHeart />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      <span className="text-sm">From ${event.price}</span>
                    </div>
                    <div className="flex items-center text-sm space-x-1">
                      <FiCalendar className="shrink-0" />
                      <span className="truncate">{formatDate(event.date, event.time)}</span>
                    </div>
                    <div className="flex items-center text-sm space-x-1">
                      <FiMapPin className="shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Events Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              New events in <span className="text-gray-400">NYC</span>
            </h2>
            <div className="flex space-x-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-200">
              <Image
                src="/images/urbanmarathon.png"
                alt="Urban Jungle Marathon"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">From $20</span>
                  <button className="text-white hover:text-pink-500">
                    <FaHeart />
                  </button>
                </div>
                <h3 className="font-medium mb-2">Urban Jungle Marathon</h3>
                <div className="flex items-center text-sm space-x-1">
                  <FiCalendar className="shrink-0" />
                  <span>Monday, June 24 | 08:00 AM</span>
                </div>
                <div className="flex items-center text-sm space-x-1">
                  <FiMapPin className="shrink-0" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>

            <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-200">
              <Image
                src="/images/rock-festival.jpg"
                alt="Rocker the Stage"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">From $100</span>
                  <button className="text-white hover:text-pink-500">
                    <FaHeart />
                  </button>
                </div>
                <h3 className="font-medium mb-2">Rocker the Stage</h3>
                <div className="flex items-center text-sm space-x-1">
                  <FiCalendar className="shrink-0" />
                  <span>Monday, March 14 | 04:00 PM</span>
                </div>
                <div className="flex items-center text-sm space-x-1">
                  <FiMapPin className="shrink-0" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>

            <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-200">
              <Image
                src="/images/melody-mania.jpg"
                alt="Melody Mania"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Free ticket</span>
                  <button className="text-white hover:text-pink-500">
                    <FaHeart />
                  </button>
                </div>
                <h3 className="font-medium mb-2">Melody Mania</h3>
                <div className="flex items-center text-sm space-x-1">
                  <FiCalendar className="shrink-0" />
                  <span>Wednesday, June 24 | 07:00 PM</span>
                </div>
                <div className="flex items-center text-sm space-x-1">
                  <FiMapPin className="shrink-0" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
          </div>

          {/* View More Button */}
          <button className="w-full mt-8 py-3 text-pink-500 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
            View more
          </button>
        </div>
      </div>
    </div>
  );
} 