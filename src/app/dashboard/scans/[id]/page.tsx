// app/dashboard/scans/[id]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '../../../../../lib/prisma'
import ScanResults from '@/app/components/dashboard/ScanResults';

async function getScanResult(id: string) {
  try {
    const scan = await prisma.fileScan.findUnique({
      where: { id }
    });

    if (!scan) {
      return null;
    }

    return scan;
  } catch (error) {
    console.error('Error fetching scan:', error);
    return null;
  }
}

export default async function ScanResultPage({
  params
}: {
  params: { id: string }
}) {
  const scan = await getScanResult(params.id);

  if (!scan) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Scan Results</h1>
        <p className="mt-1 text-gray-400">
          Detailed analysis results for your file
        </p>
      </div>

      <ScanResults 
        result={scan.scanResults as any} 
        fileName={scan.fileName}
      />
    </div>
  );
}