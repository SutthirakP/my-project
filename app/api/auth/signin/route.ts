import { NextResponse } from 'next/server';
import { users } from '@/app/utils/mockUsers';

export async function POST(req: { json: () => PromiseLike<{ username: any; password: any; }> | { username: any; password: any; }; }) {
  const { username, password } = await req.json();

  // ตรวจสอบว่ามีผู้ใช้ที่ตรงกันหรือไม่
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    return NextResponse.json({ username: user.username, role: user.role }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
  }
}
