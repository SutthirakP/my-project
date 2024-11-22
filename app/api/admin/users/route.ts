import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { checkAuth } from '@/app/action/checkAuth';
import { validateRequest } from '@/app/action/validateRequest';

// เพิ่มการรองรับ GET Method
export async function GET(request: Request) {
  const authResult = await checkAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // ตรวจสอบการเข้าถึง
  const authResult = await checkAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // ตรวจสอบความถูกต้องของข้อมูล
  const validationResult = await validateRequest(request);
  if (validationResult instanceof NextResponse) {
    return validationResult;
  }

  // ถ้า auth และ validation ผ่าน ให้ทำงานตามปกติ
  try {
    const { username, email, role, password } = await request.json();

    // แฮชรหัสผ่านก่อนที่จะเก็บในฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        role,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
