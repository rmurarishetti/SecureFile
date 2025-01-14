// app/api/scans/[id]/details/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { virusTotal } from '../../../../../../lib/services/virustotal';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scan = await prisma.fileScan.findUnique({
      where: { id: params.id }
    });

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
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

        return NextResponse.json({
          scan,
          virusTotalData: vtAnalysis.data
        });
      } catch (error) {
        console.error('Error fetching VirusTotal results:', error);
        return NextResponse.json({ scan, virusTotalData: null });
      }
    }

    // Return scan without VirusTotal data if no scanId
    return NextResponse.json({ scan, virusTotalData: null });
  } catch (error) {
    console.error('Error fetching scan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}