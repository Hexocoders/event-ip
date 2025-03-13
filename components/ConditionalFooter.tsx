'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');

  if (isDashboard) {
    return null;
  }

  return <Footer />;
} 