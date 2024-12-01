'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutButton from "./components/LogoutButton";
import { recordVisit } from "./action/visits";
import Shop from "./components/Shop";
import Carousel from "./components/Carousel";

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // ดึงข้อมูลสินค้าจาก API
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

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
    fetchProducts();
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
    {/* Logo */}
    <div className="flex items-center">
      <Link href="/" className="brand-logo text-2xl font-bold text-white">
        Florence Keyboards
      </Link>
    </div>
          {/* Right-Aligned User Info */}
          {currentUser ? (
            <div className="user-info">
              <span className="text-m font-medium text-white">
                {currentUser.username} | {currentUser.role}
              </span>
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
  <section className="hero-section bg-gray-100 py-16 px-6 md:px-16 hero-section-bg">
    <div className="flex flex-col md:flex-row items-center justify-between w-full h-full">
      {/* Left Content */}
      <div className="max-w-lg space-y-4 text-center md:text-left border border-gray-300 bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-500">
          Experience the Ultimate Typing Revolution
        </h2>
        <p className="text-4xl font-extrabold text-gray-900 leading-tight">
          Premium Mechanical Keyboards for All Generations
        </p>
        <p className="text-gray-600">
          "Florence Keyboards offers unparalleled precision and durability in every keystroke. Perfect for gamers, writers, and enthusiasts alike."
        </p>
        <div className="flex space-x-4 mt-6 justify-center md:justify-start">
          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300">
            Explore Products
          </button>
          <button className="border border-gray-700 text-gray-700 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>

          {/* Right Image */}
          <div className="relative mt-8 md:mt-0 w-full max-w-sm">
            <img
              src="/bg1.jpg"
              alt="Exclusive Collection"
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Highlight Section */}
      <hr />
      <section className="testimonial-section bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Why Choose Florence Keyboards?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow-md rounded-md">
              <blockquote className="text-gray-600">
                <span className="text-purple-500 text-4xl font-bold">“</span>
                At Florence Keyboards, we believe every keystroke matters. That’s why we craft premium mechanical keyboards designed for enthusiasts and professionals alike.
              </blockquote>
            </div>
            <div className="p-6 bg-white shadow-md rounded-md">
              <blockquote className="text-gray-600">
                <span className="text-purple-500 text-4xl font-bold">“</span>
                Discover the perfect blend of design, durability, and precision. Our mechanical keyboards are built to enhance your typing and gaming experience.
              </blockquote>
            </div>
            <div className="p-6 bg-white shadow-md rounded-md">
              <blockquote className="text-gray-600">
                <span className="text-purple-500 text-4xl font-bold">“</span>
                Why settle for less when you can have perfection? Florence Keyboards redefines what a mechanical keyboard should be.
              </blockquote>
            </div>
          </div>
        </div>
      </section>
        <div>
          <Carousel items={products} />
        </div>
        <br />
        <hr />
        <div>
          <Shop />
        </div>
        <br />
        <br />
      </main>

      <footer className="home-footer bg-white/90 py-16 text-gray-900">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
    {/* Left Section */}
    <div className="flex-col md:items-center ">
      <h3 className="text-2xl font-bold mb-4">Florence Keyboards</h3>
      <p className="text-gray-700 text-sm">
        Enhancing your typing and gaming experience with premium mechanical keyboards.
      </p>
    </div>

    {/* Middle Section */}
    <div className="flex flex-col items-center md:items-center text-center">
      <h3 className="text-xl font-bold mb-4">Quick Navigation</h3>
      <ul className="text-gray-700 space-y-2">
        <li>
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
        </li>
        <li>
          <Link href="/shop" className="hover:text-gray-900">
            Shop
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-gray-900">
            About Us
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-gray-900">
            Contact Us
          </Link>
        </li>
      </ul>
    </div>

    {/* Right Section */}
    <div className="flex flex-col items-center md:items-center text-center">
      <h3 className="text-xl font-bold mb-4">Connect with us</h3>
      <ul className="text-gray-700 space-y-2">
        <li className="flex items-center justify-center space-x-2">
          <img
            src="/icons/facebook.svg"
            alt="Facebook"
            className="w-5 h-5"
          />
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900"
          >
            Facebook
          </a>
        </li>
        <li className="flex items-center justify-center space-x-2">
          <img
            src="/icons/instagram.svg"
            alt="Instagram"
            className="w-5 h-5"
          />
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900"
          >
            Instagram
          </a>
        </li>
        <li className="flex items-center justify-center space-x-2">
          <img
            src="/icons/twitter.svg"
            alt="Twitter"
            className="w-5 h-5"
          />
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900"
          >
            Twitter
          </a>
        </li>
      </ul>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="mt-16 border-t border-gray-300 pt-8 text-center">
    <p className="text-gray-700 text-sm">&copy; 2024 Florence Keyboards. All rights reserved.</p>
    <div className="mt-4">
      <Link href="/privacy" className="mr-4 hover:text-gray-900">
        Privacy Policy
      </Link>
      <Link href="/terms" className="hover:text-gray-900">
        Terms of Service
      </Link>
    </div>
  </div>
</footer>

    </div>
  );
}
