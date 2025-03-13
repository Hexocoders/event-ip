import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  // Refresh session if expired - this is the only thing we'll do for now
  await supabase.auth.getSession();

  return res;
}

// Specify which routes should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - calendar page
     * - my-events page
     * - teams page
     * - payment page
     * - messages page
     * - settings page
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|calendar|my-events|teams|payment|messages|settings).*)',
  ],
} 