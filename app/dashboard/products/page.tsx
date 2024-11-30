"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaUsers, FaBlog, FaBolt } from "react-icons/fa";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  likes: number;
  isNew: boolean;
  category: string;
  brand: string;
  scale: string;
};

export default function DashboardProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [likes, setLikes] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [scale, setScale] = useState("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err.message);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Add or Update product
  const handleSaveProduct = async () => {
    if (!name || !price || !imageUrl || !likes || !category || !brand || !scale) {
      alert("Please fill all fields!");
      return;
    }

    const productData = {
      name,
      price: parseFloat(price),
      imageUrl,
      likes: parseInt(likes, 10),
      isNew,
      category,
      brand,
      scale,
    };

    try {
      setLoading(true);
      if (editingProductId) {
        const response = await fetch(`/api/products/${editingProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error("Failed to update product");
      } else {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error("Failed to add product");
      }
      fetchProducts();
      clearForm();
      alert("Product saved successfully!");
    } catch (err: any) {
      console.error(err.message);
      alert("An error occurred while saving the product");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      fetchProducts();
      alert("Product deleted successfully!");
    } catch (err: any) {
      console.error(err.message);
      alert("An error occurred while deleting the product");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing product
  const handleEditProduct = (product: Product) => {
    setName(product.name);
    setPrice(String(product.price));
    setImageUrl(product.imageUrl);
    setLikes(String(product.likes));
    setIsNew(product.isNew);
    setCategory(product.category);
    setBrand(product.brand);
    setScale(product.scale);
    setEditingProductId(product.id);
  };

  // Clear form
  const clearForm = () => {
    setName("");
    setPrice("");
    setImageUrl("");
    setLikes("");
    setIsNew(false);
    setCategory("");
    setBrand("");
    setScale("");
    setEditingProductId(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-800 text-white flex flex-col items-center py-5 space-y-8">
        <h2 className="text-2xl font-bold">Base</h2>
        <Link href="/dashboard" className="mb-4">
          <FaUsers size={24} title="Dashboard" />
        </Link>
        <Link href="/dashboard/products" className="mb-4">
          <FaShoppingCart size={24} title="Products" />
        </Link>
        <div className="mt-auto">
          <button className="bg-gray-700 rounded-full p-3 hover:bg-gray-600">
            <FaBolt size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Form */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Likes"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <label>
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="mr-2"
            />
            Is New
          </label>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Scale"
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <button
            onClick={handleSaveProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
          {editingProductId && (
            <button
              onClick={clearForm}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && <p>Loading...</p>}

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-20 w-20 object-cover rounded"
              />
              <h2 className="font-bold text-lg mt-2">{product.name}</h2>
              <p>Price: ${product.price}</p>
              <p>Likes: {product.likes}</p>
              <p>Category: {product.category}</p>
              <p>Brand: {product.brand}</p>
              <p>Scale: {product.scale}</p>
              <p>New: {product.isNew ? "Yes" : "No"}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
