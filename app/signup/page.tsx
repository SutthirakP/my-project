'use client';

import SignUp from '../components/auth/SignUp/SignUp';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-purple-200">
      {/* Card Container */}
      <div className="flex w-full max-w-4xl shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
        {/* Hello Section */}
        <div className="w-1/2 bg-gradient-to-r from-purple-500 to-purple-700 text-white p-10 flex flex-col items-center justify-center rounded-l-3xl rounded-tr-[80px] rounded-br-[80px]">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="mb-6 text-center">
            To keep connected with us, please login with your personal information.
          </p>
          <button
            className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-transform transform hover:scale-105 "
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </button>
        </div>

        {/* Sign Up Section */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <SignUp onSignInClick={undefined} />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
