// components/BlogSection.tsx

import Image from 'next/image';

export default function BlogSection() {
  return (
    <section className="blog-section py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">MY <span className="text-green-500">BLOG</span></h2>
      </div>
      <div className="flex justify-center gap-10">
        {/* Blog Item 1 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
          <Image
            src="https://images.unsplash.com/photo-1636787732775-e0eb5d157b42?q=80&w=3840&fit=crop&ixlib=rb-4.0.3"
            alt="Blog Image 1"
            width={400}
            height={300}
            className="w-full object-cover rounded-t-lg"
          />
          <div className="p-5">
            <p className="text-sm text-gray-500">June 30, 2021 | Design</p>
            <h3 className="text-xl font-bold mt-2">Latest Trend In Business</h3>
            <p className="text-gray-700 mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim eveniet incidunt quidem illum repellat.</p>
            <a href="#" className="block mt-6 text-purple-600 font-bold">Read More</a>
          </div>
        </div>

        {/* Blog Item 2 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
          <Image
            src="https://images.unsplash.com/photo-1626869031561-9b3e4b571bc5?q=80&w=3840&fit=crop&ixlib=rb-4.0.3"
            alt="Blog Image 2"
            width={400}
            height={300}
            className="w-full object-cover rounded-t-lg"
          />
          <div className="p-5">
            <p className="text-sm text-gray-500">June 30, 2021 | Business</p>
            <h3 className="text-xl font-bold mt-2">Latest Trend In Business</h3>
            <p className="text-gray-700 mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim eveniet incidunt quidem illum repellat.</p>
            <a href="#" className="block mt-6 text-purple-600 font-bold">Read More</a>
          </div>
        </div>

        {/* Blog Item 3 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm">
          <Image
            src="https://images.unsplash.com/photo-1605902711622-cfb43c4437c3?q=80&w=3840&fit=crop&ixlib=rb-4.0.3"
            alt="Blog Image 3"
            width={400}
            height={300}
            className="w-full object-cover rounded-t-lg"
          />
          <div className="p-5">
            <p className="text-sm text-gray-500">June 30, 2021 | Technology</p>
            <h3 className="text-xl font-bold mt-2">Latest Trend In Business</h3>
            <p className="text-gray-700 mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim eveniet incidunt quidem illum repellat.</p>
            <a href="#" className="block mt-6 text-purple-600 font-bold">Read More</a>
          </div>
        </div>
      </div>
    </section>
  );
}
