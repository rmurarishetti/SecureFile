// app/api/scans/history/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

/**
* Scan History API Endpoint
* Retrieves all scan records for a specified user
* 
* @route GET /api/scans/history
* @param email - Query parameter for user identification
* 
* @returns {Object} Scan history data
* @returns {Array} response.scans - Array of user's scan records
* 
* @throws {400} - Missing email parameter
* @throws {404} - User not found
* @throws {500} - Server error during processing
*/
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's scans
    const scans = await prisma.fileScan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      scans,
    });
  } catch (error) {
    console.error('Error fetching scans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan history' },
      { status: 500 }
    );
  }
}