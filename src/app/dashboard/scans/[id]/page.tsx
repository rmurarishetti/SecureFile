// app/dashboard/scans/[id]/page.tsx
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSession } from '@auth0/nextjs-auth0';
import ScanResults from '@/app/components/dashboard/ScanResults';
import { prisma } from '../../../../../lib/prisma';

// Mock VirusTotal response for now
const mockVirusTotalResponse = {
  data: {
    attributes: {
      status: "completed",
      stats: {
        malicious: 0,
        suspicious: 0,
        undetected: 66,
        harmless: 0
      },
      results: {
        "Kaspersky": {
          "category": "undetected",
          "engine_name": "Kaspersky",
          "result": null
        },
        "McAfee": {
          "category": "undetected",
          "engine_name": "McAfee",
          "result": null
        },
        "CrowdStrike": {
          "category": "undetected",
          "engine_name": "CrowdStrike Falcon",
          "result": null
        },
        "Symantec": {
          "category": "undetected",
          "engine_name": "Symantec",
          "result": null
        },
      }
    },
    meta: {
      file_info: {
        size: 13946,
        md5: "e7a3021779ce48df7fc34995f9d71e04",
        sha1: "2796c923c381271cabc06cfcf217c5e435deda55",
        sha256: "ff4e79f9b32eca0beabcc376f07723815d8c8ff06832f067f3445f7f871c54c9"
      }
    }
  }
};

async function getScanDetails(id: string) {
  try {
    const scan = await prisma.fileScan.findUnique({
      where: { id }
    });

    if (!scan) {
      return null;
    }

    // Only return results if scan is completed
    if (scan.status === 'COMPLETED') {
      return {
        scan,
        results: mockVirusTotalResponse.data.attributes,
        meta: mockVirusTotalResponse.data.meta
      };
    }

    // For pending or other states, just return the scan info
    return {
      scan,
      results: null,
      meta: null
    };
  } catch (error) {
    console.error('Error fetching scan:', error);
    return null;
  }
}

export default async function ScanPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getSession();
  
  if (!session?.user?.email) {
    notFound();
  }

  const data = await getScanDetails(params.id);
  
  if (!data) {
    notFound();
  }

  return (
    <div>
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
          result={data.results}
          fileName={data.scan.fileName}
          status={data.scan.status}
        />
      </div>
    </div>
  );
}