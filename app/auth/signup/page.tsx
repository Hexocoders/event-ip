'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

interface FormData {
  full_name: string;
  email: string;
  password: string;
  terms: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    password: '',
    terms: false,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      router.push('/auth/login?message=Account created successfully! Please log in.');
    } catch (err: unknown) {  // Explicitly typing the error
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8e7ed] px-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8 relative">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          onClick={() => router.push('/')}
        >
          ✕
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome.</h1>
          <p className="text-gray-600 mb-8">Create an account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="example.email@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter at least 8+ characters"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400"
              required
              minLength={6}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree with <Link href="/terms" className="text-gray-600 underline">Terms & Conditions</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-gray-400 text-white rounded text-sm font-medium hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center p-3 border border-gray-300 rounded hover:bg-gray-50"
            >
              <FcGoogle className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center p-3 border border-gray-300 rounded hover:bg-gray-50"
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
