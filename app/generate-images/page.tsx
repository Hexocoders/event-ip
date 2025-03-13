'use client';

import EventImage from '@/components/EventImage';

export default function GenerateImages() {
  return (
    <div>
      <EventImage tier="default" width={800} height={400} />
      <EventImage tier="silver" width={800} height={400} />
      <EventImage tier="gold" width={800} height={400} />
      <EventImage tier="platinum" width={800} height={400} />
    </div>
  );
} 