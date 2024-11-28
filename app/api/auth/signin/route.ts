import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // ตรวจสอบว่า username และ password มีค่าหรือไม่
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // ค้นหาผู้ใช้ในฐานข้อมูล โดยดึงเฉพาะฟิลด์ที่จำเป็น
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
      },
    });

    // ตรวจสอบว่า username และ password ตรงกันหรือไม่
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // ตรวจสอบตัวแปร JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // กำหนดอายุของ token
    );

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Error during authentication:', error);

    return NextResponse.json(
      {
        message: 'Something went wrong',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
