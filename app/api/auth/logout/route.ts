import { NextResponse } from 'next/server';

export async function POST() {
  // Return a response indicating logout success
  return NextResponse.json({ message: 'Logout successful' });
}
