'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Link from 'next/link';
import { FaUsers, FaShoppingCart, FaBlogger } from 'react-icons/fa';

// Chart.js initialization
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
};

type CurrentUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

const Dashboard = () => {
  const [users, setUsers] = useState<CurrentUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [visitData, setVisitData] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
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
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data: CurrentUser[] = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch products from API (mocked data for now)
  const fetchProducts = () => {
    setProducts([
      {
        id: '1',
        name: 'NIKE Shoes Black Pattern',
        price: 87,
        rating: 5,
        image: '/nike-shoes.jpg',
      },
      {
        id: '2',
        name: 'iPhone 12',
        price: 987,
        rating: 4,
        image: '/iphone-12.jpg',
      },
    ]);
  };

  // Fetch visits data from API
  const fetchVisits = async () => {
    try {
      const response = await fetch('/api/visits', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Assuming 'createdAt' is a Date field, map it to count the number of visits per hour
        const formattedData = data.visits.map((visit: any) => new Date(visit.createdAt).getHours());
        
        // Example to count visits per hour (mock implementation)
        const visitCounts = new Array(24).fill(0);
        formattedData.forEach((hour: number) => {
          visitCounts[hour]++;
        });

        setVisitData(visitCounts);
      } else {
        console.error('Failed to fetch visits');
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
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

        const decoded = jwt.decode(token) as JwtPayload & { role?: string, username?: string, email?: string, id?: number, createdAt?: string };

        if (decoded && decoded.role === 'Admin') {
          await fetchUsers();
          fetchProducts(); // Fetch products
          await fetchVisits(); // Fetch visits data for chart
          setCurrentUser({
            id: decoded.id || 0,
            username: decoded.username || 'Unknown',
            email: decoded.email || '',
            role: decoded.role || 'User',
            createdAt: decoded.createdAt || new Date().toISOString(),
          });
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
        fetchUsers();
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Prepare chart data using visitData state
  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Labels for each hour
    datasets: [
      {
        label: 'Visits Over Time',
        data: visitData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-800 text-white flex flex-col items-center py-5 space-y-8">
        <h2 className="text-2xl font-bold">Base</h2>
        <div className="flex flex-col space-y-6">
        <Link href="/users" className="text-center flex flex-col items-center">
          <FaUsers size={24} title="Users" />
          </Link>
          <Link href="/products" className="text-center flex flex-col items-center">
            <FaShoppingCart size={24} title="Products" />
          </Link>
          <Link href="/blog" className="text-center flex flex-col items-center">
            <FaBlogger size={24} title="Blog" />
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Reports Section (Chart) */}
          <div className="bg-white p-4 rounded-lg shadow-md col-span-2">
            <h2 className="text-2xl mb-4 font-semibold text-gray-800">Reports</h2>
            <div className="h-128">
              <Line data={chartData} />
            </div>
          </div>

          <div className="grid grid-rows-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-gray-700">{users.length}</h2>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-gray-700">{users.filter(user => user.role === 'Admin').length}</h2>
              <p className="text-sm text-gray-500">Total Admins</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-gray-700">{currentUser ? `${currentUser.username} | ${currentUser.role}` : 'No User'}</h2>
              <p className="text-sm text-gray-500">Current User</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* User List Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4 font-semibold text-gray-800">User List</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="w-1/4 px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600">User ID</th>
                  <th className="w-1/4 px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600">Username</th>
                  <th className="w-1/4 px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="w-1/4 px-4 py-2 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border-b">{user.id}</td>
                    <td className="px-4 py-2 border-b">{user.username}</td>
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Selling Products Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4 font-semibold text-gray-800">Top Selling Products</h2>
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                    <p className="text-sm text-gray-500">${product.price}</p>
                    <div className="text-yellow-400">
                      {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
