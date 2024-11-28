'use client';

import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogoutButton from "./components/LogoutButton";
import BlogSection from "./components/ฺBlogSection";
import { recordVisit } from "./action/visits";


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

    {/* Centered Links */}
    <div className="nav-links">
      <Link href="/shop">Shop</Link>
      <Link href="/blog">Blog</Link>
    </div>

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
        <section className="hero-section">
          <Image
            className="hero-image rounded-lg"
            src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Mechanical Keyboard Image"
            width={1200}
            height={800}
            priority
          />
          <div className="hero-text">
            <h1>Your brand mission statement can be stated here.</h1>
            <p>This is where you share the heartbeat of your brand. Simple yet effective text that makes your audience feel connected to the message.</p>
          </div>
        </section>
        <BlogSection />
        <section className="gallery-section">
          <div className="gallery-item">
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1612600840881-8aba94904ab9?q=80&w=3871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Custom Keyboard 1"
              width={600}
              height={400}
            />
            <p>Keyboard One</p>
          </div>
          <div className="gallery-item">
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1636787732775-e0eb5d157b42?q=80&w=3840&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Custom Keyboard 2"
              width={600}
              height={400}
            />
            <p>Keyboard Two</p>
          </div>
          <div className="gallery-item">
            <Image
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1634306625640-04ac053e544b?q=80&w=3928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Custom Keyboard 3"
              width={600}
              height={400}
            />
            <p>Keyboard Three</p>
          </div>
        </section>

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
