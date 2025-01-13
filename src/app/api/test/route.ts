// app/api/test/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getOrCreateUser, getUserFiles } from '../../../../lib/services/user';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Test 1: Create/Get User
    const user = await getOrCreateUser({
      email: session.user.email as string,
      name: session.user.name || undefined
    });

    // Test 2: Get User's Files
    const files = await getUserFiles(user.id);

    return NextResponse.json({
      success: true,
      user,
      files,
      session: {
        email: session.user.email,
        name: session.user.name
      }
    });

  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}