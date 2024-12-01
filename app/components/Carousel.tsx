'use client';

import { useEffect, useRef, useState } from 'react';

type Item = {
  imageUrl: string;
  name: string;
};

const Carousel: React.FC<{ items: Item[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current index
  const intervalRef = useRef<null | ReturnType<typeof setInterval>>(null); // Ref to store the interval

  // Start the auto-slide functionality
  const startAutoSlide = () => {
    if (items.length > 1) {
      // Start auto-slide only if there are more than 1 item
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length); // Increment the index
      }, 5000); // 5 seconds interval
    }
  };

  // Stop the auto-slide functionality
  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the interval
    }
  };

  useEffect(() => {
    startAutoSlide(); // Start auto-slide on mount
    return () => stopAutoSlide(); // Cleanup the interval on unmount
  }, [items]); // Dependency array ensures the effect re-runs when items change

  if (items.length === 0) {
    return <p className="text-center text-gray-500">No items available</p>; // Display a message if no items are available
  }

  return (
    <div className="relative w-full max-w-screen-lg mx-auto overflow-hidden">
      <h2 className="text-xl font-bold text-center my-4">Best Sellers</h2>
      <div className="flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() =>
            setCurrentIndex(
              (prevIndex) => (prevIndex - 1 + items.length) % items.length // Move to the previous item
            )
          }
          className="absolute left-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          &#8249;
        </button>

        {/* Carousel Items */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }} // Translate based on the current index
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="min-w-full flex-shrink-0 flex flex-col items-center"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-[400px] h-[300px] object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-gray-700 font-medium">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() =>
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length) // Move to the next item
          }
          className="absolute right-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          &#8250;
        </button>
      </div>
      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-black' : 'bg-gray-400' // Highlight the active indicator
            }`}
            onClick={() => setCurrentIndex(index)} // Navigate to the respective slide
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
