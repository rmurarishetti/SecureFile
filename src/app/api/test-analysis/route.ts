// app/api/test-analysis/route.ts
import { NextResponse } from 'next/server';
import { virusTotal } from '../../../../lib/services/virustotal';

export async function GET() {
  try {
    const scanId = 'ZTdhMzAyMTc3OWNlNDhkZjdmYzM0OTk1ZjlkNzFlMDQ6MTczNjU4NzA4OQ==';
    
    // Get analysis from VirusTotal
    const analysis = await virusTotal.getAnalysis(scanId);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to get analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}