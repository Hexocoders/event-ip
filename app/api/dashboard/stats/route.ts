import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { DashboardStats, ApiResponse } from '@/types';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get total events count
    const { count: totalEvents, error: eventsError } = await supabase
      .from('events')
      .select('*', { count: 'exact' });

    if (eventsError) {
      throw new Error('Failed to fetch total events');
    }

    // Get upcoming events count
    const { count: upcomingEvents, error: upcomingError } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .gte('date', new Date().toISOString());

    if (upcomingError) {
      throw new Error('Failed to fetch upcoming events');
    }

    // Get total teams count
    const { count: totalTeams, error: teamsError } = await supabase
      .from('teams')
      .select('*', { count: 'exact' });

    if (teamsError) {
      throw new Error('Failed to fetch total teams');
    }

    // Get active teams (teams with events in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: activeTeams, error: activeTeamsError } = await supabase
      .from('teams')
      .select('*', { count: 'exact' })
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (activeTeamsError) {
      throw new Error('Failed to fetch active teams');
    }

    const stats: DashboardStats = {
      totalEvents: totalEvents || 0,
      upcomingEvents: upcomingEvents || 0,
      totalTeams: totalTeams || 0,
      activeTeams: activeTeams || 0
    };

    const response: ApiResponse<DashboardStats> = {
      data: stats,
      status: 200
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 