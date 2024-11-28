'use client';

import React, { useState } from 'react';

interface ProductFormProps {
  onSubmit: (product: { name: string; price: number; imageUrl: string; likes: number; isNew: boolean }) => void;
  initialValues?: { name: string; price: number; imageUrl: string; likes: number; isNew: boolean };
}

export default function ProductForm({ onSubmit, initialValues }: ProductFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [price, setPrice] = useState(initialValues?.price?.toString() || '');
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || '');
  const [likes, setLikes] = useState(initialValues?.likes?.toString() || '');

  const handleSubmit = () => {
    if (!name || !price || !imageUrl || !likes) {
      alert('Please fill out all fields.');
      return;
    }

    onSubmit({
      name,
      price: Number(price),
      imageUrl,
      likes: Number(likes),
      isNew: true,
    });

    clearForm();
  };

  const clearForm = () => {
    setName('');
    setPrice('');
    setImageUrl('');
    setLikes('');
  };

  return (
    <div className="p-4 border rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Add New Product</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="number"
        value={likes}
        onChange={(e) => setLikes(e.target.value)}
        placeholder="Likes"
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}
