'use client';

import { useState } from 'react';
import SignIn from '../components/auth/SignIn/SignIn';
import SignUp from '../components/auth/SignUp/SignUp';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Handlers to toggle between Sign In and Sign Up forms
  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-purple-200">
      {/* Card Container */}
      <div className="flex w-full max-w-4xl shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden rounded-3xl">
        
        {/* Sign In Section */}
        <div className={`w-1/2 p-10 flex flex-col justify-center transition-transform duration-500 ${isSignUp ? 'translate-x-full opacity-0' : 'opacity-100'}`}>
          <h2 className="text-3xl font-bold text-gray-700 mb-2">Sign In</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your credentials to access your account.
          </p>
          <SignIn onSignUpClick={handleSignUpClick} />
        </div>

        {/* Hello Section */}
        <div className="w-1/2 bg-gradient-to-r from-purple-500 to-purple-700 text-white p-10 flex flex-col items-center justify-center rounded-tl-[80px] rounded-bl-[80px]">
          <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
          <p className="mb-6 text-center">
            Register with your personal details to use all site features.
          </p>
          <button
            className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-transform transform hover:scale-105"
            onClick={() => window.location.href = '/signup'}
          >
            Sign Up
          </button> 
        </div>
      </div>
    </div>
  );
};

export default LoginPage;