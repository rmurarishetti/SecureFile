// components/dashboard/ScanStatusChecker.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ScanStatusCheckerProps {
  scanId: string;
  dbId: string;
  status: string;
}

export default function ScanStatusChecker({ scanId, dbId, status }: ScanStatusCheckerProps) {
  const router = useRouter();

  useEffect(() => {
    if (status !== 'COMPLETED' && status !== 'ERROR') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/protected/scans/${dbId}/check?vtScanId=${scanId}`);
          if (!response.ok) throw new Error('Failed to check status');
          
          const data = await response.json();
          
          if (data.status === 'COMPLETED' || data.status === 'ERROR') {
            clearInterval(interval);
            router.refresh();
          }
        } catch (error) {
          console.error('Error checking scan status:', error);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [scanId, dbId, status, router]);

  return null;
}