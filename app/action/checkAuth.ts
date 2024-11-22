import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function checkAuth(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

    // คุณสามารถเพิ่มเงื่อนไขเพิ่มเติมที่ต้องการตรวจสอบได้ที่นี่ เช่น ตรวจสอบ role
    if (decoded && decoded.role === 'Admin') {
      return true; // อนุญาตให้ผ่าน
    } else {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
