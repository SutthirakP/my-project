'use client'

import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const getUserDataFromToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwt.decode(token) as { username: string; role: string } | null;
          if (decoded && decoded.username && decoded.role) {
            setCurrentUser({ username: decoded.username, role: decoded.role });
          }
        } catch (error) {
          console.error('Invalid token');
        }
      }
    };

    getUserDataFromToken(); // Load user data initially

    // Run getUserDataFromToken whenever the route changes
    const handleRouteChange = () => {
      getUserDataFromToken();
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushstate', handleRouteChange);

    // Cleanup when component is unmounted
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushstate', handleRouteChange);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    router.push('/signin');
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token); // Store the token here
        setCurrentUser({ username: data.username, role: data.role }); // Set current user
        router.push('/'); // Redirect to home
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <nav className="home-nav">
          <Link href="/" className="brand-logo">
            Florence Keyboards
          </Link>
          <div className="nav-links">
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/contact">Contact</Link>
            {currentUser ? (
              <div className="user-info">
                <span>{currentUser.username} | {currentUser.role}</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            ) : (
              <div className="auth-links">
                <button onClick={() => router.push('/login')} className="login-button">Login</button>
                <Link href="/signup">Signup</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <Image
            className="hero-image"
            src="/keyboard.jpg"
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

        <section className="gallery-section">
          <div className="gallery-item">
            <Image
              src="/keyboard-1.jpg"
              alt="Custom Keyboard 1"
              width={600}
              height={400}
            />
            <p>Keyboard One</p>
          </div>
          <div className="gallery-item">
            <Image
              src="/keyboard-2.jpg"
              alt="Custom Keyboard 2"
              width={600}
              height={400}
            />
            <p>Keyboard Two</p>
          </div>
          <div className="gallery-item">
            <Image
              src="/keyboard-3.jpg"
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
