'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signInSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const SignIn = ({ onSignUpClick }) => {
  // React Hook Form setup with Zod validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const handleSignInSubmit = (data) => {
    console.log('Sign In Data:', data);
  };

  return (
    <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit(handleSignInSubmit)}>
      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          {...register('username')}
          id="username"
          type="text"
          placeholder="Enter your username"
          className={`w-full px-4 py-3 mt-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition`}
        />
        {errors.username && (
          <span className="text-red-600 text-sm">{errors.username.message}</span>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...register('password')}
          id="password"
          type="password"
          placeholder="Enter your password"
          className={`w-full px-4 py-3 mt-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition`}
        />
        {errors.password && (
          <span className="text-red-600 text-sm">{errors.password.message}</span>
        )}
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition transform hover:scale-105 duration-300"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignIn;
