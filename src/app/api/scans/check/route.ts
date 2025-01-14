// app/api/scans/check/route.ts
import { NextResponse } from 'next/server';
import { virusTotal } from '../../../../../lib/services/virustotal';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vtScanId = searchParams.get('vtScanId');
    const dbId = searchParams.get('dbId');
    const email = searchParams.get('email');

    if (!vtScanId || !dbId || !email) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // Verify the scan belongs to the user
    const scan = await prisma.fileScan.findFirst({
      where: {
        id: dbId,
        user: {
          email: email
        }
      }
    });

    if (!scan) {
      return NextResponse.json({ 
        error: 'Scan not found' 
      }, { status: 404 });
    }

    // Get analysis from VirusTotal using the provided vtScanId
    const analysis = await virusTotal.getAnalysis(vtScanId);
    console.log('Analysis:', analysis);

    // If analysis is completed, update our database
    if (analysis.data.attributes.status === 'completed') {
      await prisma.fileScan.update({
        where: { id: dbId },
        data: { 
          status: 'COMPLETED',
          //analysisResults: JSON.stringify(analysis.data.attributes) // Optional: store full analysis results
        }
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