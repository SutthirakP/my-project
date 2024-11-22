import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      return NextResponse.json({ username: user.username, role: user.role });
    } else {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}
