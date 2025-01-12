// components/AuthButtons.tsx
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function AuthButtons() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="h-8 w-20 bg-white/10 animate-pulse rounded-full" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          href="/api/auth/logout"
          className="text-sm bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
        >
          Logout
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/api/auth/login"
      className="text-sm bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      Sign In
    </Link>
  );
}