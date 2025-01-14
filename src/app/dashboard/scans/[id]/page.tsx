// app/dashboard/scans/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import ScanResults from '@/app/components/dashboard/ScanResults';
import ScanStatusChecker from '@/app/components/dashboard/ScanStatusChecker';

interface ScanData {
  scan: {
    id: string;
    fileName: string;
    fileSize: number;
    status: string;
    scanId?: string;
  };
  virusTotalData: any | null;
}

export default function ScanPage({
  params,
}: {
  params: { id: string }
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user?.email) {
        router.push('/api/auth/login');
        return;
      }

      const fetchScanDetails = async () => {
        try {
          const response = await fetch(`/api/scans/${params.id}/details`);
          if (!response.ok) {
            if (response.status === 404) {
              router.push('/404');
              return;
            }
            throw new Error('Failed to fetch scan details');
          }
          
          const data = await response.json();
          setScanData(data);
        } catch (error) {
          console.error('Error fetching scan details:', error);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchScanDetails();
    }
  }, [user, isLoading, router, params.id]);

  if (isLoading || isLoadingData) {
    return <div>Loading...</div>;
  }

  if (!scanData) {
    return null;
  }

  const showStatusChecker = scanData.scan.status !== 'COMPLETED' && 
                          scanData.scan.status !== 'ERROR' && 
                          scanData.scan.scanId;

  return (
    <div>
      {showStatusChecker && (
        <ScanStatusChecker
          dbId={scanData.scan.id}
          scanId={scanData.scan.scanId!}
          status={scanData.scan.status}
        />
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Scan Results</h1>
        <p className="mt-1 text-gray-400">
          {scanData.scan.status === 'PENDING' 
            ? 'Your file is being processed...' 
            : scanData.scan.status === 'COMPLETED'
            ? 'Detailed analysis of your file'
            : 'The scan is queued'
          }
        </p>
      </div>

      <div className="mt-6">
        <ScanResults
          fileName={scanData.scan.fileName}
          fileSize={scanData.scan.fileSize}
          status={scanData.scan.status}
          virusTotalData={scanData.virusTotalData}
        />
      </div>
    </div>
  );
}