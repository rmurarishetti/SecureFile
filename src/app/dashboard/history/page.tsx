// app/dashboard/history/page.tsx
import { getSession } from '@auth0/nextjs-auth0';
import ScanHistory from '@/app/components/dashboard/ScanHistory';
import { redirect } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import ScanStatusChecker from '@/app/components/dashboard/ScanStatusChecker';

async function getScans(userId: string) {
  try {
    const scans = await prisma.fileScan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    return {
      scans,
      totalPages: 1 // Add pagination later
    };
  } catch (error) {
    console.error('Error fetching scans:', error);
    return { scans: [], totalPages: 0 };
  }
}

export default async function HistoryPage() {
  const session = await getSession();
  
  if (!session?.user?.email) {
    redirect('/api/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect('/api/auth/login');
  }

  const { scans, totalPages } = await getScans(user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Scan History</h1>
        <p className="mt-1 text-gray-400">
          View and manage your previous file scans
        </p>
      </div>

      <div className="mt-6">
        <ScanHistory initialScans={scans} totalPages={totalPages} />
      </div>

      {/* Add status checkers for pending scans */}
      {scans.map(scan => 
        scan.status === 'PENDING' && scan.scanId ? (
          <ScanStatusChecker 
            key={scan.id}
            dbId={scan.id}
            scanId={scan.scanId}
            status={scan.status}
          />
        ) : null
      )}
    </div>
  );
}