// app/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/app/components/dashboard/Sidebar';

async function getOrCreateUser(email: string, name?: string | null) {
  try {
    const response = await fetch('/api/user/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });
    
    if (!response.ok) throw new Error('Failed to upsert user');
    return await response.json();
  } catch (error) {
    console.error('Error upserting user:', error);
    return null;
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error: authError, isLoading } = useUser();
  const router = useRouter();
  const [dbUser, setDbUser] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/api/auth/login');
      } else if (user.email) {
        getOrCreateUser(user.email, user.name || undefined)
          .then(userData => {
            if (!userData) {
              setError('Failed to create/fetch user');
              router.push('/');
            } else {
              setDbUser(userData);
            }
          })
          .catch(err => {
            console.error('Error in user setup:', err);
            setError('Failed to set up user');
          });
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || authError) {
    return <div>Error: {error || authError?.message}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-red-500/10"
          style={{
            maskImage: 'radial-gradient(circle at center, white, transparent)',
            WebkitMaskImage: 'radial-gradient(circle at center, white, transparent)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex h-screen">
        <DashboardSidebar 
          name={user.name || ''} 
          email={user.email || ''} 
        />
        <main className="flex-1 pl-64 overflow-auto">
          <div className="px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}