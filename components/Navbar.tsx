'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FiUser, FiLogOut, FiChevronDown, FiPlus } from 'react-icons/fi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface User {
  id: string
  full_name: string
  email: string
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClientComponentClient()

  // Check if the current path is in the dashboard section
  const isDashboardSection = pathname?.startsWith('/dashboard') || 
                            pathname?.startsWith('/my-events') || 
                            pathname?.startsWith('/calendar') ||
                            pathname?.startsWith('/teams') ||
                            pathname?.startsWith('/payment') ||
                            pathname?.startsWith('/messages') ||
                            pathname?.startsWith('/settings')

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (data) {
            setUser(data)
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUserDetails()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        router.push('/auth/login')
      } else if (session?.user && event === 'SIGNED_IN') {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (data) {
          setUser(data)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-1">
              <span className="font-righteous text-2xl text-pink-500">Event</span>
              <span className="font-righteous text-2xl text-gray-400">-</span>
              <span className="font-dancing-script text-2xl text-purple-600">ip</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isDashboardSection && user && (
              <div className="hidden md:flex items-center space-x-6 mr-4">
                <Link 
                  href="/events" 
                  className={`text-gray-600 hover:text-gray-900 font-medium ${
                    pathname === '/events' ? 'text-pink-500' : ''
                  }`}
                >
                  Upcoming Events
                </Link>
                <Link 
                  href="/my-events" 
                  className={`text-gray-600 hover:text-gray-900 font-medium ${
                    pathname === '/my-events' ? 'text-pink-500' : ''
                  }`}
                >
                  My Events
                </Link>
              </div>
            )}

            {!pathname?.startsWith('/auth/') && pathname !== '/' && (
              <Link
                href="/events/create"
                className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors"
              >
                <FiPlus className="w-4 h-4 mr-1" />
                Create Event
              </Link>
            )}
            
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-pink-500" />
                  </div>
                  <span className="hidden sm:block font-medium truncate max-w-[100px]">
                    {user.full_name}
                  </span>
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100 font-medium truncate">
                      {user.email}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-pink-500 text-white hover:bg-pink-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}