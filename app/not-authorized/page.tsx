import Link from 'next/link';
import { useRouter } from 'next/router';


const NotAuthorized = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">You do not have permission to view this page.</p>
      <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md">
        Go to Home
      </Link>
    </div>
  );
};

export default NotAuthorized;
