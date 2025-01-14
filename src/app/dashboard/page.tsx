// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import FileUpload from "@/app/components/dashboard/FileUpload";
import { format } from 'date-fns';

interface Stats {
  totalScans: number;
  threatsDetected: number;
  lastScanDate: string;
}

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchStats() {
      if (user?.email) {
        try {
          const response = await fetch(`/api/stats?email=${encodeURIComponent(user.email)}`);
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setIsLoadingStats(false);
        }
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  const statCards = [
    { 
      label: 'Files Scanned', 
      value: stats?.totalScans.toString() || '0'
    },
    { 
      label: 'Last Scan', 
      value: stats?.lastScanDate || 'Never'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">File Scanner</h1>
        <p className="mt-1 text-gray-400">
          Upload files to scan them for potential security threats.
        </p>
      </div>

      <div className="mt-6">
        <FileUpload />
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-black/50 backdrop-blur-md p-6 rounded-lg border border-gray-800"
          >
            <p className="text-sm font-medium text-gray-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}