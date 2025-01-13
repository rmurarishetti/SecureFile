// app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '../../../lib/prisma';
import DashboardSidebar from '@/app/components/dashboard/Sidebar';

async function getOrCreateUser(email: string, name?: string | null) {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
      },
      create: {
        email,
        name: name || undefined,
      },
    });
    return user;
  } catch (error) {
    console.error('Error upserting user:', error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session?.user?.email) {
    redirect('/api/auth/login');
  }

  // Get or create user in database
  const user = await getOrCreateUser(session.user.email, session.user.name);
  
  if (!user) {
    console.error('Failed to create/fetch user');
    redirect('/');
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
        <DashboardSidebar name={session.user.name} email={session.user.email} />
        <main className="flex-1 pl-64 overflow-auto">
          <div className="px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}