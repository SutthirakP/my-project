'use client'

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getCurrentUser } from '@/app/utils/auth';  // ใช้ getCurrentUser เพื่อเช็คการล็อกอิน

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
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // เพิ่มการยืนยันสิทธิ์
        },
      });
      if (response.ok) {
        const data: User[] = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        // Decode JWT เพื่อตรวจสอบ
        const decoded = jwt.decode(token) as JwtPayload & { role?: string };

        if (decoded && decoded.role === 'Admin') {
          await fetchUsers(); // เรียกฟังก์ชัน fetchUsers เมื่อผู้ใช้เป็น Admin
        } else {
          router.push('/not-authorized');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        router.push('/signin');
      }
    };

    fetchCurrentUser();
  }, [router]);

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
        fetchUsers(); // Refresh user list after successful creation
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
