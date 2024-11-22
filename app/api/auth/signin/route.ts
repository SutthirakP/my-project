import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // ตรวจสอบว่า username กับ password มีข้อมูลครบถ้วนหรือไม่
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      // สร้าง JWT token
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // กำหนดระยะเวลาของ token
      );

      return NextResponse.json({ token, username: user.username, role: user.role });
    } else {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
  
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Something went wrong', error: 'Unknown error' }, { status: 500 });
    }
  }
}  