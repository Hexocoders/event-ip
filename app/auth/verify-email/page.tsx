'use client';

import Link from 'next/link';
import { FiMail } from 'react-icons/fi';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <FiMail className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent you a verification link to your email address.
            Please click the link to verify your account.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or
          </p>
          <Link
            href="/auth/signup"
            className="text-pink-600 hover:text-pink-500 font-medium"
          >
            try another email address
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
} 