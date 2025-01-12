// app/dashboard/history/page.tsx
import { getSession } from '@auth0/nextjs-auth0';
import ScanHistory from '@/app/components/dashboard/ScanHistory';
import { prisma } from '../../../../lib/prisma';

async function getScans(userId: string) {
    try {
        const scans = await prisma.fileScan.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10, // Items per page
        });

        const total = await prisma.fileScan.count({
            where: { userId },
        });

        return {
            scans,
            totalPages: Math.ceil(total / 10)
        };
    } catch (error) {
        console.error('Error fetching scans:', error);
        return { scans: [], totalPages: 0 };
    }
}

export default async function HistoryPage() {
    const session = await getSession();
    const { scans, totalPages } = await getScans(session?.user?.sub || '045e4290-dd96-4453-8162-132d2b4f5c22');

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scan History</h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    View and manage your previous file scans.
                </p>
            </div>

            <div className="mt-6">
                <ScanHistory initialScans={scans} totalPages={totalPages} />
            </div>
        </div>
    );
}