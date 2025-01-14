// app/api/user/upsert/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

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