import { NextResponse } from 'next/server';
import prisma from "@/app/utils/db";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Validate the input data
    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields: username, email, and password' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error creating user', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
