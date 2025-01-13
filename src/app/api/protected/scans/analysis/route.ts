// app/api/scans/analysis/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { virusTotal } from '../../../../../../lib/services/virustotal';
import { prisma } from '../../../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const scanId = searchParams.get('scanId');
    const dbId = searchParams.get('dbId');

    if (!scanId || !dbId) {
      return NextResponse.json(
        { error: 'Missing scan ID or database ID' },
        { status: 400 }
      );
    }

    // Get scan record using scanId
    const scan = await prisma.fileScan.findFirst({
      where: {
        scanId: scanId,
        user: {
          email: session.user.email
        }
      }
    });

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    // Get analysis from VirusTotal using the scanId directly
    const analysis = await virusTotal.getAnalysis(scanId);

    // If analysis is completed, update scan status
    if (analysis.data.attributes.status === 'completed') {
      await prisma.fileScan.update({
        where: { id: dbId },
        data: {
          status: 'COMPLETED'
        }
      });
    }

    return NextResponse.json(analysis.data);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to get analysis' },
      { status: 500 }
    );
  }
}