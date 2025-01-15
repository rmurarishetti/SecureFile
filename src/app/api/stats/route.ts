// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getUserByEmail, getUserStats } from '../../../../lib/services/user';
import { format } from 'date-fns';

/**
* User Statistics API Endpoint
* Retrieves scan statistics and activity data for a user
* 
* @route GET /api/stats
* @param email - Query parameter for user email
* 
* @returns {Object} Statistics object
* @returns {number} response.totalScans - Total number of scans performed
* @returns {number} response.threatsDetected - Total threats found
* @returns {string} response.lastScanDate - Formatted date of most recent scan
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
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const stats = await getUserStats(user.id);
    const lastScan = user.fileScans?.[0]?.createdAt;

    return NextResponse.json({
      totalScans: stats.total || 0,
      threatsDetected: stats.error || 0,
      lastScanDate: lastScan ? format(lastScan, 'MMM dd, yyyy') : 'Never'
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}