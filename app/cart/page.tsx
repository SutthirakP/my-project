'use client';

import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p>Payment options and cart summary go here.</p>
      <Link href="/">
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
