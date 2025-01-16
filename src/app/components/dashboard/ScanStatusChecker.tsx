// components/dashboard/ScanStatusChecker.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

interface ScanStatusCheckerProps {
  scanId: string;
  dbId: string;
  status: string;
}

export default function ScanStatusChecker({ scanId, dbId, status }: ScanStatusCheckerProps) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading || !user?.email) return;

    if (status !== 'COMPLETED' && status !== 'ERROR') {
      const interval = setInterval(async () => {
        if(user.email)
        try {
          const response = await fetch(
            `/api/scans/check?vtScanId=${encodeURIComponent(scanId)}&dbId=${encodeURIComponent(dbId)}&email=${encodeURIComponent(user.email)}`
          );
          
          if (!response.ok) throw new Error('Failed to check status');
          
          const data = await response.json();
          
          if (data.status === 'COMPLETED' || data.status === 'ERROR') {
            clearInterval(interval);
            router.refresh();
          }
        } catch (error) {
          console.error('Error checking scan status:', error);
        }
      }, 20000); // Check every 20 seconds

      return () => clearInterval(interval);
    }
  }, [scanId, dbId, status, router, user, isLoading]);

  return null;
}