'use client';

import SearchBar from '../components/SearchBar'
import Categories from '../components/Categories'
import EventCard from '../components/EventCard'
import Hero from '../components/Hero'
import { FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'
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

const FEATURED_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Urban Marathon',
    description: 'Join us for the biggest marathon event in NYC. Experience the thrill of running through the city streets at sunrise.',
    date: '2024-06-06',
    time: '06:00',
    location: 'New York, NY',
    price: 20,
    tier: 'silver',
    image: '/images/urbanmarathon.png'
  },
  {
    id: '2',
    title: 'Melody Mania',
    description: 'A night of unforgettable music and performances',
    date: '2024-06-21',
    time: '19:00',
    location: 'New York, NY',
    price: 40,
    tier: 'gold',
    image: '/images/urbanmarathon.png'
  },
  {
    id: '3',
    title: "Rockin' the Stage",
    description: 'Experience the best rock bands live in concert',
    date: '2024-03-14',
    time: '16:00',
    location: 'New York, NY',
    price: 122,
    tier: 'platinum',
    image: '/images/urbanmarathon.png'
  }
];

const UPCOMING_EVENTS: Event[] = [
  {
    id: '4',
    title: 'Musical Fusion Festival',
    description: 'Where genres collide and magic happens',
    date: '2024-06-06',
    time: '06:00',
    location: 'New York, NY',
    price: 100,
    tier: 'platinum',
    image: '/images/image16.png'
  },
  {
    id: '5',
    title: 'Business in the United States',
    description: 'Network with industry leaders and entrepreneurs',
    date: '2024-06-07',
    time: '06:00',
    location: 'Atlanta',
    price: 50,
    tier: 'gold',
    image: '/images/image17.png'
  }
];

const MORE_EVENTS: Event[] = [
  {
    id: '6',
    title: 'Marathon',
    description: 'Challenge yourself in this exciting marathon',
    date: '2024-06-06',
    time: '06:00',
    location: 'New York, NY',
    price: 115,
    tier: 'silver',
    image: '/images/image25.png'
  },
  {
    id: '7',
    title: 'Rock Festival',
    description: 'A day of pure rock and roll',
    date: '2024-03-21',
    time: '20:00',
    location: 'New York, NY',
    price: 175,
    tier: 'platinum',
    image: '/images/image24.png'
  },
  {
    id: '8',
    title: 'Harmony of Melodies Concert',
    description: 'Experience the magic of classical music',
    date: '2024-06-24',
    time: '19:00',
    location: 'New York, NY',
    price: 90,
    tier: 'gold',
    image: '/images/image23.png'
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Search Bar */}
      <div className="relative">
        <Hero />
        {/* Search Bar positioned at the bottom of hero section */}
        <div className="absolute -bottom-8 left-0 right-0 px-4">
          <div className="mx-auto max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-24 pb-8">
        {/* New Events Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              New events in <span className="text-purple-600">NYC</span>
            </h2>
            <Link href="/events" className="group flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors">
              View more
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_EVENTS.map(event => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              Explore by <span className="text-gray-400">categories</span>
            </h2>
            <Link href="/categories" className="group flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors">
              View more
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Categories />
        </section>

        {/* Upcoming Events */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              Upcoming <span className="text-gray-400">in 24h</span>
            </h2>
            <Link href="/events/upcoming" className="group flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors">
              View more
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {UPCOMING_EVENTS.map(event => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        </section>

        {/* Featured Event */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">Highlights this week</h2>
          <div className="relative overflow-hidden rounded-2xl bg-gray-900">
            {/* Background Image */}
            <div className="relative h-[500px]">
              <Image 
                src="/images/Image 19.png" 
                alt="Brushstrokes & Beyond: Art Exhibition" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            </div>
            
            {/* Content Box */}
            <div className="absolute bottom-8 left-8 max-w-lg">
              <div className="rounded-xl bg-white/95 p-8 backdrop-blur-sm">
                <p className="text-sm font-medium text-purple-600 mb-2">From $8</p>
                <h3 className="text-2xl font-bold mb-4">
                  Brushstrokes & Beyond: An Oil Painting Odyssey
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FiCalendar className="mr-2" />
                  <span>Tuesday, June 7 | 06:00 PM</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-6">
                  <FiMapPin className="mr-2" />
                  <span>2678 Forest Avenue, San Jose, CA 95111</span>
                </div>
                <button className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Purchase Ticket
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* More Events */}
        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">More events</h2>
            <Link href="/events" className="group flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors">
              View more
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {MORE_EVENTS.map(event => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
} 