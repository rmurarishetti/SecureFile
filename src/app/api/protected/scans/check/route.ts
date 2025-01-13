// app/api/scans/check/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { virusTotal } from '../../../../../../lib/services/virustotal';
import { prisma } from '../../../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vtScanId = searchParams.get('vtScanId');
    const dbId = searchParams.get('dbId');

    if (!vtScanId || !dbId) {
      return NextResponse.json({ error: 'Missing scan ID' }, { status: 400 });
    }

    // Get analysis from VirusTotal using the vtScanId
    const analysis = await virusTotal.getAnalysis(vtScanId);

    // If analysis is completed, update our database
    if (analysis.data.attributes.status === 'completed') {
      await prisma.fileScan.update({
        where: { id: dbId },
        data: { status: 'COMPLETED' }
      });

      return NextResponse.json({ 
        status: 'COMPLETED', 
        data: analysis.data 
      });
    }

    // Return current status
    return NextResponse.json({ 
      status: 'PENDING', 
      data: analysis.data 
    });
  } catch (error) {
    console.error('Error checking scan status:', error);
    return NextResponse.json(
      { error: 'Failed to check scan status' },
      { status: 500 }
    );
  }
}