'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ConditionalFooter from '@/components/ConditionalFooter';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      {!isDashboard && <ConditionalFooter />}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
} 