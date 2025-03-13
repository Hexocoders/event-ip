'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCalendar, FiUsers, FiCreditCard, FiMessageSquare, FiSettings } from 'react-icons/fi';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="space-y-4">
          <Link 
            href="/dashboard" 
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              isActive('/dashboard') 
                ? 'bg-pink-50 text-pink-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiHome className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/calendar" 
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              isActive('/calendar') 
                ? 'bg-pink-50 text-pink-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiCalendar className="w-5 h-5" />
            <span>Calendar</span>
          </Link>
          <Link 
            href="/my-events" 
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              isActive('/my-events') 
                ? 'bg-pink-50 text-pink-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiHome className="w-5 h-5" />
            <span>My Events</span>
          </Link>
          <Link 
            href="/teams" 
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              isActive('/teams') 
                ? 'bg-pink-50 text-pink-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiUsers className="w-5 h-5" />
            <span>Teams</span>
          </Link>
          <Link 
            href="/payment" 
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              isActive('/payment') 
                ? 'bg-pink-50 text-pink-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiCreditCard className="w-5 h-5" />
            <span>Payment</span>
          </Link>
          <Link 
            href="/messages" 
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              isActive('/messages') 
                ? 'bg-pink-50 text-pink-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiMessageSquare className="w-5 h-5" />
            <span>Messages</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
          </Link>
          <Link 
            href="/settings" 
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
              isActive('/settings') 
                ? 'bg-pink-50 text-pink-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiSettings className="w-5 h-5" />
            <span>Setting</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 