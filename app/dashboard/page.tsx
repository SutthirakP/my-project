'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ใช้เพื่อเปลี่ยนหน้าเมื่อไม่ได้รับอนุญาต
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client'; // Import type User จาก Prisma Schema
import { getCurrentUser } from '@/app/utils/auth'; // Import ฟังก์ชัน getCurrentUser ที่คุณสร้างไว้

const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['User', 'Admin']).optional(),
});

type FormValues = {
  username: string;
  email: string;
  role?: 'User' | 'Admin';
};

const Dashboard = () => {
  const router = useRouter(); // ใช้เพื่อเปลี่ยนหน้าเมื่อไม่มีสิทธิ์
  const [users, setUsers] = useState<User[]>([]); // กำหนด type ของ users ให้เป็น Array ของ User
  const [currentUser, setCurrentUser] = useState<User | null>(null); // เพิ่ม state สำหรับเก็บข้อมูลผู้ใช้ที่ล็อกอินอยู่

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser(); // เรียกฟังก์ชัน getCurrentUser เพื่อดึงข้อมูลผู้ใช้
        if (user?.role !== 'Admin') {
          // ถ้าไม่ใช่ Admin ให้เปลี่ยนหน้าไปหน้าอื่น
          router.push('/not-authorized'); // เปลี่ยนไปยังหน้าที่ไม่อนุญาตให้เข้าถึง
        } else {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();

    // Fetch users list only if currentUser is admin
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data: User[] = await response.json(); // เพิ่ม type ให้กับ data
          setUsers(data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (currentUser?.role === 'Admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert('User created successfully');
        setUsers([...users, data as User]); // อัปเดตข้อมูล user ใหม่ใน state
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {currentUser && (
          <div className="border px-4 py-2 rounded-md bg-gray-100">
            Logged in as: {currentUser.username} ({currentUser.role})
          </div>
        )}
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl mb-4">Create New User</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              {...register('username')}
              id="username"
              type="text"
              className={`w-full px-4 py-2 mt-1 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.username && (<p className="text-red-500 text-sm mt-1">{String(errors.username.message)}</p>)}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className={`w-full px-4 py-2 mt-1 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>}
          </div>

          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md">Create User</button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl mb-4">User List</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="w-1/3 px-4 py-2 border">Username</th>
              <th className="w-1/3 px-4 py-2 border">Email</th>
              <th className="w-1/3 px-4 py-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
