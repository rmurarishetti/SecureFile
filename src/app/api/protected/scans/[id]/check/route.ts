// app/api/protected/scans/[id]/check/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '../../../../../../../lib/prisma';
import { virusTotal } from '../../../../../../../lib/services/virustotal';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vtScanId = searchParams.get('vtScanId');

    if (!vtScanId) {
      return NextResponse.json({ error: 'Missing scan ID' }, { status: 400 });
    }

    // Get VirusTotal analysis results
    const vtAnalysis = await virusTotal.getAnalysis(vtScanId);

    // If analysis is completed, update our database
    if (vtAnalysis.data.attributes.status === 'completed') {
      await prisma.fileScan.update({
        where: { id: params.id },
        data: { status: 'COMPLETED' }
      });

      return NextResponse.json({ status: 'COMPLETED', data: vtAnalysis.data });
    }

    // Return current status
    return NextResponse.json({ status: 'PENDING', data: vtAnalysis.data });
  } catch (error) {
    console.error('Error checking scan status:', error);
    return NextResponse.json(
      { error: 'Failed to check scan status' },
      { status: 500 }
    );
  }
}