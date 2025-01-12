// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { getSession } from '@auth0/nextjs-auth0';
import FileUpload from "@/app/components/dashboard/FileUpload";
import { getUserByEmail, getUserStats } from '../../../lib/services/user';
import { format } from 'date-fns';

async function getStats(userEmail: string) {
  try {
    const user = await getUserByEmail(userEmail);
    if (!user) return null;
    
    const stats = await getUserStats(user.id);
    const lastScan = user.fileScans?.[0]?.createdAt;

    return {
      totalScans: stats.total || 0,
      threatsDetected: stats.error || 0,  // Assuming 'error' status means threat detected
      lastScanDate: lastScan ? format(lastScan, 'MMM dd, yyyy') : 'Never'
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  const stats = session?.user ? await getStats(session.user.email as string) : null;

  const statCards = [
    { 
      label: 'Files Scanned', 
      value: stats?.totalScans.toString() || '0'
    },
    { 
      label: 'Threats Detected', 
      value: stats?.threatsDetected.toString() || '0'
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
        <FileUpload userEmail={session?.user?.email} />
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
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