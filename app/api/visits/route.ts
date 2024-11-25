import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch visits with createdAt field
    const visits = await prisma.visit.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ visits });
  } catch (error) {
    console.error('Failed to fetch visits:', error);
    return NextResponse.json({ error: 'Failed to create visit' }, { status: 500 });
  }
}


export async function POST() {
  try {
    const newVisit = await prisma.visit.create({
      data: {
        createdAt: new Date(),
      },
    });
    return NextResponse.json(newVisit);
  } catch (error) {
    console.error('Error recording visit:', error);
    return NextResponse.json({ error: 'Failed to create visit' }, { status: 500 });
  }
}
