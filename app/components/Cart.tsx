"use client";

import { useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function Cart({ cartItems, updateCart }: any) {
  const [paymentMethod, setPaymentMethod] = useState("");

  // Handle quantity change
  const handleQuantityChange = (id: number, quantity: number) => {
    updateCart(id, quantity);
  };

  // Handle payment method
  const handlePayment = () => {
    alert(`Payment method selected: ${paymentMethod}`);
    // Redirect to order confirmation
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item: CartItem) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.name}</span>
                <span>${item.price}</span>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                  className="border rounded w-16 p-1"
                />
                <button
                  onClick={() => updateCart(item.id, 0)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h2 className="text-xl mt-4">
  Total: $
  {cartItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)}
</h2>
          <div className="mt-4">
            <label>
              Payment Method:
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="Cash">Cash</option>
                <option value="PayPal">PayPal</option>
                <option value="PromptPay">PromptPay</option>
              </select>
            </label>
            <button
              onClick={handlePayment}
              className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
