import { NextResponse } from 'next/server';

export async function validateRequest(request: Request) {
  try {
    const { username, email, role, password } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ message: 'Invalid username' }, { status: 400 });
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (role && !['User', 'Admin'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    return true; // Validation passed
  } catch (error) {
    console.error('Error during request validation:', error);
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}
