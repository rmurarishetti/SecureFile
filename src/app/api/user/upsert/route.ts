// app/api/user/upsert/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

/**
* User Upsert API Endpoint
* Creates or updates user record based on email
* 
* @route POST /api/user/upsert
* @body {Object} request body
* @body {string} body.email - User's email address
* @body {string} [body.name] - Optional user's name
* 
* @returns {Object} Created or updated user object
* 
* @throws {400} - Missing email
* @throws {500} - Database operation failure
*/
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    /**
    * Upsert user record
    * Creates new user if email doesn't exist
    * Updates name if user exists
    */
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
      },
      create: {
        email,
        name: name || undefined,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error upserting user:', error);
    return NextResponse.json(
      { error: 'Failed to upsert user' },
      { status: 500 }
    );
  }
}