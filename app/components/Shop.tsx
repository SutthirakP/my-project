"use client";

import { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  likes: number;
  isNew: boolean;
  category: string;
  scale: string;
  brand: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedScales, setSelectedScales] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"default" | "low" | "high">(
    "default"
  );
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const increaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesScale =
        selectedScales.length === 0 || selectedScales.includes(product.scale);

      return matchesSearch && matchesCategory && matchesBrand && matchesScale;
    })
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  const predefinedBrands = ["Logitech", "Nubwo", "Ducky", "Razer", "Akko"];
  const predefinedScales = ["60%", "80%", "100%"];
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  const calculateTotalPrice = () =>
    cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const toggleLike = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/like`, {
        method: "POST",
      });
  
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, likes: updatedProduct.likes }
              : product
          )
        );
      } else {
        console.error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed top-4 right-4">
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600"
          >
            🛒
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg overflow-y-auto z-50">
          <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center mb-4 border-b pb-2"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="font-bold">{item.product.name}</h3>
                      <p>${item.product.price}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => decreaseQuantity(item.product.id)}
                        className="text-gray-500 hover:text-gray-800 px-2"
                      >
                        −
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.product.id)}
                        className="text-gray-500 hover:text-gray-800 px-2"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 ml-4"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <span className="text-lg font-bold">
                Total: ${calculateTotalPrice().toFixed(2)}
              </span>
              <button
                onClick={() => alert("Proceed to buy!")}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">Shop</h1>

      {/* Search Bar and Sorting */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 w-1/3"
        />
        <select
          className="border p-2 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "default" | "low" | "high")}
        >
          <option value="default">Default sorting</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* Filters */}
      <div className="flex">
        <div className="w-1/4 pr-4">
          <h2 className="font-bold mb-2">Categories</h2>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedCategories((prev) =>
                        isChecked
                          ? [...prev, category]
                          : prev.filter((cat) => cat !== category)
                      );
                    }}
                    className="mr-2"
                  />
                  {category}
                </label>
              </li>
            ))}
          </ul>

          <h2 className="font-bold mt-4">Brands</h2>
          <ul>
            {predefinedBrands.map((brand, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedBrands((prev) =>
                        isChecked
                          ? [...prev, brand]
                          : prev.filter((b) => b !== brand)
                      );
                    }}
                    className="mr-2"
                  />
                  {brand}
                </label>
              </li>
            ))}
          </ul>

          <h2 className="font-bold mt-4">Scales</h2>
          <ul>
            {predefinedScales.map((scale, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={scale}
                    checked={selectedScales.includes(scale)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedScales((prev) =>
                        isChecked
                          ? [...prev, scale]
                          : prev.filter((s) => s !== scale)
                      );
                    }}
                    className="mr-2"
                  />
                  {scale}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4">
  {loading ? (
    <p>Loading products...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="relative border rounded-lg shadow hover:shadow-md transition bg-white flex flex-col justify-between h-full"
        >
          {/* Product Image */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
          />

          {/* Product Info */}
          <div className="p-4 flex-grow">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">Brand: {product.brand}</p>
            <p className="text-sm text-gray-600">Scale: {product.scale}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center p-4 border-t">
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
            <div className="flex items-center">
              <button
                onClick={() => toggleLike(product.id)}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                  product.likes > 0 ? "bg-red-500 text-white" : "bg-gray-300 text-gray-600"
                } hover:scale-110 transition`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c2.58 0 5 2.42 5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
              <span className="ml-2 text-sm text-gray-600">{product.likes}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      </div>
    </div>
  );
}
