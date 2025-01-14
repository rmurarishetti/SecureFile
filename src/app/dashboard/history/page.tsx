// app/dashboard/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import ScanHistory from '@/app/components/dashboard/ScanHistory';
import ScanStatusChecker from '@/app/components/dashboard/ScanStatusChecker';

interface Scan {
  id: string;
  status: string;
  scanId?: string;
  // Add other scan properties as needed
}

interface ScanData {
  scans: Scan[];
  totalPages: number;
}

export default function HistoryPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [scanData, setScanData] = useState<ScanData>({ scans: [], totalPages: 0 });
  const [isLoadingScans, setIsLoadingScans] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user?.email) {
        router.push('/api/auth/login');
        return;
      }

      // Fetch user's scans

      const fetchScans = async () => {
        if (user?.email) {
          try {
            const response = await fetch(`/api/scans/history?email=${encodeURIComponent(user.email)}`);
            if (!response.ok) throw new Error('Failed to fetch scans');

            const data = await response.json();
            setScanData(data);
          } catch (error) {
            console.error('Error fetching scans:', error);
          } finally {
            setIsLoadingScans(false);
          }
        }
      };

      fetchScans();
    }
  }, [user, isLoading, router]);

  if (isLoading || isLoadingScans) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Scan History</h1>
        <p className="mt-1 text-gray-400">
          View and manage your previous file scans
        </p>
      </div>

      <div className="mt-6">
        <ScanHistory initialScans={scanData.scans} totalPages={scanData.totalPages} />
      </div>

      {/* Add status checkers for pending scans */}
      {scanData.scans.map(scan =>
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