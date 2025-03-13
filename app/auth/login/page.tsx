'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEmailConfirmationSent, setIsEmailConfirmationSent] = useState(false);
  const supabase = createClientComponentClient();

  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setError(error.message);
      } else {
        setIsEmailConfirmationSent(true);
      }
    } catch (err) {
      setError('Failed to resend confirmation email');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setIsEmailConfirmationSent(false);

    try {
      // First, sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData?.user) {
        // Fetch user details from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user details:', userError);
        }

        // Store user details in localStorage if needed
        if (userData) {
          localStorage.setItem('userDetails', JSON.stringify(userData));
        }

        // Redirect to dashboard after successful login
        window.location.href = 'http://localhost:3000/dashboard';
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An error occurred with OAuth sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8e7ed] px-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          onClick={() => router.push('/')}
        >
          ✕
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome.</h1>
          <p className="text-gray-600 mb-8">Sign in to your account</p>
        </div>

        {message && (
          <div className="mb-4 text-sm text-green-600 text-center">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {error}
            {error.toLowerCase().includes('email not confirmed') && (
              <button
                onClick={handleResendConfirmation}
                className="ml-2 text-blue-600 hover:text-blue-700 underline"
              >
                Resend confirmation email
              </button>
            )}
          </div>
        )}

        {isEmailConfirmationSent && (
          <div className="mb-4 text-sm text-green-600 text-center">
            Confirmation email has been resent. Please check your inbox.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              className="flex items-center justify-center p-3 border border-gray-300 rounded hover:bg-gray-50"
            >
              <FcGoogle className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('facebook')}
              className="flex items-center justify-center p-3 border border-gray-300 rounded hover:bg-gray-50"
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/auth/signup" className="text-sm text-blue-600 hover:text-blue-700">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}