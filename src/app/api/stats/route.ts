// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getUserByEmail, getUserStats } from '../../../../lib/services/user';
import { format } from 'date-fns';

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