import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to view dashboard' },
        { status: 401 }
      );
    }

    // Get total revenue and tickets sold
    const salesStats = await db.query(
      `SELECT 
        COALESCE(SUM(t.price), 0) as total_revenue,
        COUNT(t.id) as total_tickets_sold
       FROM events e
       LEFT JOIN tickets t ON e.id = t.event_id
       WHERE e.user_id = ?`,
      [user.id]
    ) as any[];

    // Get event views and shares
    const eventStats = await db.query(
      `SELECT 
        COUNT(DISTINCT e.id) as total_events,
        COALESCE(SUM(e.views), 0) as total_views,
        COALESCE(SUM(e.shares), 0) as total_shares
       FROM events e
       WHERE e.user_id = ?`,
      [user.id]
    ) as any[];

    // Get recent events with sales data
    const events = await db.query(
      `SELECT 
        e.id,
        e.title,
        e.date,
        e.capacity as totalCapacity,
        COUNT(DISTINCT t.id) as ticketsSold,
        COALESCE(SUM(t.price), 0) as revenue
       FROM events e
       LEFT JOIN tickets t ON e.id = t.event_id
       WHERE e.user_id = ?
       GROUP BY e.id
       ORDER BY e.date ASC`,
      [user.id]
    ) as any[];

    // Get recent purchases
    const purchases = await db.query(
      `SELECT 
        t.code,
        u.full_name as buyer,
        t.purchase_date,
        COUNT(t.id) as ticketsSold,
        SUM(t.price) as totalPrice,
        e.title as eventTitle
       FROM tickets t
       JOIN events e ON t.event_id = e.id
       JOIN users u ON t.user_id = u.id
       WHERE e.user_id = ?
       GROUP BY t.code
       ORDER BY t.purchase_date DESC
       LIMIT 5`,
      [user.id]
    ) as any[];

    return NextResponse.json({
      stats: {
        revenue: salesStats[0].total_revenue || 0,
        ticketsSold: salesStats[0].total_tickets_sold || 0,
        eventViews: eventStats[0].total_views || 0,
        eventShares: eventStats[0].total_shares || 0,
      },
      events: events.map(event => ({
        ...event,
        timeUntil: getTimeUntil(new Date(event.date))
      })),
      purchases: purchases.map(purchase => ({
        ...purchase,
        date: new Date(purchase.purchase_date).toLocaleDateString(),
        time: new Date(purchase.purchase_date).toLocaleTimeString(),
      }))
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

function getTimeUntil(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return `in ${diffDays} days`;
  if (diffDays <= 14) return 'Next 2 weeks';
  if (diffDays <= 30) return 'Next month';
  return 'Future event';
} 