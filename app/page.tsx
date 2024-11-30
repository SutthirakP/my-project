'use client';

import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogoutButton from "./components/LogoutButton";
import { recordVisit } from "./action/visits";
import Shop from "./components/Shop";


export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const recordPageVisit = async () => {
      try {
        await recordVisit();
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };
  
    const getUserDataFromSession = async () => {
      try {
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
  
        if (username && role) {
          setCurrentUser({ username, role });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setCurrentUser(null);
      }
    };
  
    recordPageVisit();
    getUserDataFromSession();
  
    const handleSessionChange = () => {
      getUserDataFromSession();
    };
  
    window.addEventListener('sessionChange', handleSessionChange);
  
    return () => {
      window.removeEventListener('sessionChange', handleSessionChange);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    <div className="home-container">
      <header className="home-header">
  <nav className="home-nav">
    {/* Left Logo */}
    <Link href="/" className="brand-logo">
      Florence Keyboards
    </Link>


    {/* Right-Aligned User Info */}
    {currentUser ? (
      <div className="user-info">
        <span className="text-sm font-medium text-gray-700">{currentUser.username} | {currentUser.role}</span>
        <LogoutButton />
      </div>
    ) : (
      <div className="auth-links">
        <Link href="/login">
          <button className="login-button">Login |</button>
        </Link>
        <Link href="/signup">
          <button className="signup-button ml-2">Sign Up</button>
        </Link>
      </div>
    )}
  </nav>
</header>

      <main className="home-main">
      <section className="hero-section relative w-full h-[60vh] overflow-hidden">
  <Image
    className="absolute top-0 left-0 w-full h-full object-cover"
    src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt="Mechanical Keyboard Image"
    width={1200}
    height={800}
    priority
  />
          </section>
          <div className="hero-text text-center">
            <h1>Your brand mission statement can be stated here.</h1>
            <p>This is where you share the heartbeat of your brand. Simple yet effective text that makes your audience feel connected to the message.</p>
          </div>

          <section className="relative bg-gray-100">
  {/* Hero Section */}
  <div className="flex flex-col md:flex-row items-center justify-between bg-gray-200 px-8 py-16">
    {/* Left Content */}
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-medium text-gray-600">
        What our customers says
      </h2>
      <p className="text-4xl font-bold text-gray-800 leading-tight">
        Exclusive Collections For Z-Generation
      </p>
      <p className="text-gray-600">
        "I'm impressed by the quality of work and the level."
      </p>
      <div className="flex space-x-4 mt-4">
        <button className="bg-black text-white px-6 py-2 rounded shadow hover:bg-gray-800">
          Shop Now
        </button>
        <button className="border border-gray-800 px-6 py-2 rounded shadow hover:bg-gray-100">
          Categories
        </button>
      </div>
    </div>

    {/* Right Image */}
    <div className="relative mt-8 md:mt-0">
      <img
        src="https://via.placeholder.com/400x500"
        alt="Exclusive Collection"
        className="rounded-lg shadow-md object-cover"
      />
      <div className="absolute top-4 right-4 bg-white shadow-lg p-4 rounded-lg">
        <p className="text-sm text-gray-800">Explore New Arrivals</p>
        <img
          src="https://via.placeholder.com/100x100"
          alt="New Arrival"
          className="mt-2 rounded-lg"
        />
      </div>
    </div>
  </div>
</section>
        <div>
          <Shop />
        </div>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <p>Florence Keyboards &copy; 2024. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
