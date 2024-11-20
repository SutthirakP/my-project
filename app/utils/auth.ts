// utils/auth.ts

import { User } from '@prisma/client';
import prisma from './db';
import { getCookie } from 'cookies-next'; // ใช้สำหรับดึงข้อมูลจาก cookie

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userId = getCookie('user_id'); // สมมติว่ามีการเก็บ user_id ไว้ใน cookie
    if (!userId) {
      return null; // ถ้าไม่มี user_id แสดงว่าไม่ได้ล็อกอิน
    }

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูลตาม user_id
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};
