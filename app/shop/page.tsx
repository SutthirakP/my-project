'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../shop/type';

const ShopPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [url, setUrl] = useState('');
    const [likes, setLikes] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    const fetchProducts = async () => {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
    };

    const addProduct = async () => {
        if (name && price && url && likes) {
            const newProduct = { name, price: Number(price), likes: Number(likes), imageUrl: url, isNew: true };

            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });

            clearForm();
            fetchProducts();
        }
    };

    const handleEdit = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setName(product.name);
            setPrice(String(product.price));
            setUrl(product.imageUrl);
            setLikes(String(product.likes));
            setEditingProductId(productId);
        }
    };

    const handleUpdate = async () => {
        await fetch(`/api/products/${editingProductId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price: Number(price), imageUrl: url, likes: Number(likes) }),
        });

        setEditingProductId(null);
        clearForm();
        fetchProducts();
    };

    const handleDelete = async (productId: number) => {
        await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        fetchProducts();
    };

    const clearForm = () => {
        setName('');
        setPrice('');
        setUrl('');
        setLikes('');
        setEditingProductId(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    React.useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">
                {editingProductId ? "Edit Product" : "Add a New Product"}
            </h2>
            <div className="flex mb-6 space-x-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                    className="border-2 border-gray-300 p-2 rounded mb-2 w-full"
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                    className="border-2 border-gray-300 p-2 rounded mb-2 w-full"
                />
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Image URL"
                    className="border-2 border-gray-300 p-2 rounded mb-2 w-full"
                />
                <input
                    type="number"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    placeholder="Likes"
                    className="border-2 border-gray-300 p-2 rounded mb-2 w-full"
                />
                <button
                    onClick={editingProductId ? handleUpdate : addProduct}
                    className="bg-gray-800 text-white py-2 px-4 rounded"
                >
                    {editingProductId ? "Update Product" : "Add Product"}
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Products"
                    className="border-2 border-gray-300 p-2 rounded w-full"
                />
            </div>

            <h2 className="text-2xl font-bold mb-4">Our Instruments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                    <div key={product.id} className="border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 bg-white relative">
                        <Link href={`/shop/${product.id}`} passHref>
                            <div className="cursor-pointer">
                                <Image 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    width={200} 
                                    height={200} 
                                    className="rounded-t-lg object-cover h-48 w-full" 
                                />
                            </div>
                        </Link>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                            <p className="text-gray-700">Price: <span className="font-bold">${product.price}</span></p>
                            <p className="text-gray-700">Likes: <span className="font-bold">{product.likes} 🫰</span></p>
                            {product.isNew && (
                                <span className="absolute top-2 right-2 bg-green-200 text-green-800 font-bold text-sm px-2 py-1 rounded-full shadow-md animate-bounce">
                                    🎉 New!
                                </span>
                            )}
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                            <button 
                                onClick={() => handleEdit(product.id)}
                                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-all"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;
