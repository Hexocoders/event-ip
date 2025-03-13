'use client'

import { Inter, Righteous, Dancing_Script } from 'next/font/google'
import { usePathname } from 'next/navigation'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DashboardFooter from '@/components/DashboardFooter'

const inter = Inter({ subsets: ['latin'] })
const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-righteous',
})
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showSimpleFooter = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/calendar') || 
                          pathname?.startsWith('/my-events') ||
                          pathname?.startsWith('/teams') ||
                          pathname?.startsWith('/payment') ||
                          pathname?.startsWith('/settings') ||
                          pathname?.startsWith('/messages')

  return (
    <html lang="en">
      <body className={`${inter.className} ${righteous.variable} ${dancingScript.variable} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="pt-16 flex-grow">
          {children}
        </main>
        {showSimpleFooter ? <DashboardFooter /> : <Footer />}
      </body>
    </html>
  )
} 