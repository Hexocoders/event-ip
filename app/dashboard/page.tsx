'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import DashboardFooter from '@/components/DashboardFooter';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface DashboardStats {
  revenue: number;
  ticketsSold: number;
  eventViews: number;
  eventShares: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  ticketsSold: number;
  totalCapacity: number;
  revenue: number;
  timeUntil: string;
}

interface Purchase {
  code: string;
  buyer: string;
  date: string;
  time: string;
  ticketsSold: number;
  totalPrice: number;
  eventTitle: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    ticketsSold: 0,
    eventViews: 0,
    eventShares: 0,
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Fetch events data
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            date,
            capacity,
            price,
            views,
            shares
          `);
        // Remove the user_id filter to show all events
        
        if (eventsError) throw eventsError;

        // Fetch tickets data
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('tickets')
          .select(`
            code,
            price,
            purchase_date,
            event_id,
            user_id
          `);
        // Remove the user_id filter to show all tickets

        if (ticketsError) throw ticketsError;

        // Calculate stats
        const calculatedStats = {
          revenue: ticketsData?.reduce((sum, ticket) => sum + (ticket.price || 0), 0) || 0,
          ticketsSold: ticketsData?.length || 0,
          eventViews: eventsData?.reduce((sum, event) => sum + (event.views || 0), 0) || 0,
          eventShares: eventsData?.reduce((sum, event) => sum + (event.shares || 0), 0) || 0,
        };

        // Format events data
        const formattedEvents = eventsData?.map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          ticketsSold: ticketsData?.filter(t => t.event_id === event.id).length || 0,
          totalCapacity: event.capacity,
          revenue: ticketsData
            ?.filter(t => t.event_id === event.id)
            .reduce((sum, ticket) => sum + (ticket.price || 0), 0) || 0,
          timeUntil: getTimeUntil(event.date),
        })) || [];

        // Format purchases data
        const formattedPurchases = ticketsData?.map(ticket => ({
          code: ticket.code,
          buyer: 'Anonymous', // You might want to fetch user details here
          date: new Date(ticket.purchase_date).toLocaleDateString(),
          time: new Date(ticket.purchase_date).toLocaleTimeString(),
          ticketsSold: 1,
          totalPrice: ticket.price,
          eventTitle: eventsData?.find(e => e.id === ticket.event_id)?.title || 'Unknown Event',
        })) || [];

        setStats(calculatedStats);
        setEvents(formattedEvents);
        setPurchases(formattedPurchases);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router, supabase]);

  const getTimeUntil = (date: string) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    if (diffDays <= 14) return '2 weeks';
    return 'Future event';
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

      {/* Main content */}
      <div className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <FiFilter className="mr-2" />
              Filter
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-pink-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-pink-500 text-2xl">$</span>
              </div>
              <div className="text-3xl font-bold text-pink-500 mb-1">${stats.revenue.toLocaleString()}</div>
              <div className="text-gray-600">Revenue</div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-500 text-2xl">🎟️</span>
              </div>
              <div className="text-3xl font-bold text-green-500 mb-1">{stats.ticketsSold}</div>
              <div className="text-gray-600">Tickets Sold</div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-500 text-2xl">👁️</span>
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-1">{stats.eventViews.toLocaleString()}</div>
              <div className="text-gray-600">Event Views</div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-500 text-2xl">🔗</span>
              </div>
              <div className="text-3xl font-bold text-yellow-500 mb-1">{stats.eventShares}</div>
              <div className="text-gray-600">Event Shares</div>
            </div>
          </div>

          {/* Sales by Event */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="text-pink-500 mr-2">$</span>
                Sales by event
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">Last updated: {new Date().toLocaleTimeString()}</span>
                <select className="border rounded px-2 py-1">
                  <option>Sort by: Sales</option>
                  <option>Sort by: Date</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of the event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/events/${event.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-lg mr-3"></div>
                          <span className="font-medium">{event.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            event.timeUntil.includes('days') ? 'bg-pink-100 text-pink-700' :
                            event.timeUntil.includes('2 weeks') ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {event.timeUntil}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{event.ticketsSold}/{event.totalCapacity}</td>
                      <td className="px-6 py-4">$ {event.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Purchases */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="text-pink-500 mr-2">🎟️</span>
                Recent purchases
              </h2>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 mr-4">Last updated: {new Date().toLocaleTimeString()}</span>
                <button className="text-pink-500 hover:text-pink-600">View all purchases</button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchases.map((purchase, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-blue-500">{purchase.code}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
                          <span>{purchase.buyer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{purchase.eventTitle}</td>
                      <td className="px-6 py-4">{purchase.date}</td>
                      <td className="px-6 py-4">{purchase.time}</td>
                      <td className="px-6 py-4">{purchase.ticketsSold}</td>
                      <td className="px-6 py-4">$ {purchase.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
}