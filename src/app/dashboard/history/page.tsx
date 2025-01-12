// app/dashboard/history/page.tsx
import { cookies } from 'next/headers';
import { getSession } from '@auth0/nextjs-auth0';
import ScanHistory from '@/app/components/dashboard/ScanHistory';
import { redirect } from 'next/navigation';
import { getUserFiles, getUserByEmail } from '../../../../lib/services/user'

async function getScans(email: string) {
  try {
    // First get the user from database
    const user = await getUserByEmail(email);
    if (!user) {
      console.error('User not found:', email);
      return { scans: [], totalPages: 0 };
    }

    // Then get their files using the database ID
    const { files, total, pages } = await getUserFiles(user.id);
    
    console.log('Found scans:', files.length); // Debug log
    
    return {
      scans: files,
      totalPages: pages
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

  const { scans, totalPages } = await getScans(session.user.email);

  // Debug log
  console.log('Rendering history page with scans:', scans?.length);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Scan History</h1>
        <p className="mt-1 text-gray-400">
          View and manage your previous file scans.
        </p>
      </div>

      <div className="mt-6">
        <ScanHistory initialScans={scans || []} totalPages={totalPages} />
      </div>
    </div>
  );
}