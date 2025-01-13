// app/dashboard/scans/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';
import ScanResults from '@/app/components/dashboard/ScanResults';
import { prisma } from '../../../../../lib/prisma';
import { virusTotal } from '../../../../../lib/services/virustotal';
import ScanStatusChecker from '@/app/components/dashboard/ScanStatusChecker';

async function getScanDetails(id: string) {
  try {
    // Get scan record from our database
    const scan = await prisma.fileScan.findUnique({
      where: { id }
    });

    if (!scan) {
      return null;
    }

    // If we have a scanId, try to get results regardless of status
    if (scan.scanId) {
      try {
        const vtAnalysis = await virusTotal.getAnalysis(scan.scanId);
        
        // If analysis is completed, update our database status
        if (vtAnalysis.data.attributes.status === 'completed' && scan.status !== 'COMPLETED') {
          await prisma.fileScan.update({
            where: { id: scan.id },
            data: { status: 'COMPLETED' }
          });
          // Update local scan object
          scan.status = 'COMPLETED';
        }

        return {
          scan,
          virusTotalData: vtAnalysis.data
        };
      } catch (error) {
        console.error('Error fetching VirusTotal results:', error);
        return { scan, virusTotalData: null };
      }
    }

    // Return scan without VirusTotal data if no scanId
    return { scan, virusTotalData: null };
  } catch (error) {
    console.error('Error fetching scan:', error);
    return null;
  }
}

export default async function ScanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession();
  const id = (await params).id;
  
  if (!session?.user?.email) {
    notFound();
  }

  const data = await getScanDetails(id);
  
  if (!data) {
    notFound();
  }

  const showStatusChecker = data.scan.status !== 'COMPLETED' && 
                          data.scan.status !== 'ERROR' && 
                          data.scan.scanId;

  return (
    <div>
      {showStatusChecker && (
        <ScanStatusChecker
          dbId={data.scan.id}
          scanId={data.scan.scanId!}
          status={data.scan.status}
        />
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Scan Results</h1>
        <p className="mt-1 text-gray-400">
          {data.scan.status === 'PENDING' 
            ? 'Your file is being processed...' 
            : data.scan.status === 'COMPLETED'
            ? 'Detailed analysis of your file'
            : 'There was an issue with the scan'
          }
        </p>
      </div>

      <div className="mt-6">
        <ScanResults
          fileName={data.scan.fileName}
          fileSize={data.scan.fileSize}
          status={data.scan.status}
          virusTotalData={data.virusTotalData}
        />
      </div>
    </div>
  );
}