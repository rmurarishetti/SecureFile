// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge'
import { getOrCreateUser } from './lib/services/user';

// Enhance the middleware to handle user creation/update
export default withMiddlewareAuthRequired(
  async function middleware(req: NextRequest) {
    try {
      const session = await getSession(req, NextResponse.next());
      
      if (session?.user) {
        // Ensure user exists in our database
        await getOrCreateUser({
          email: session.user.email as string,
          name: session.user.name || undefined
        });
      }

      // Continue with the request
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      // On error, continue anyway since auth is already verified
      return NextResponse.next();
    }
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*'
  ]
};