'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    // Fetch cart count from local storage or API
    const fetchCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    fetchCartCount();

    // Add event listener to update cart count when items are added/removed
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdate', handleCartUpdate);

    return () => window.removeEventListener('cartUpdate', handleCartUpdate);
  }, []);

  const handleCartClick = () => {
    router.push('/cart'); // Navigate to cart page
  };

  return (
    <div className="relative">
      <button
        onClick={handleCartClick}
        className="bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition relative"
      >
        🛒
      </button>
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {cartCount}
        </span>
      )}
    </div>
  );
}
