'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from './actions';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const result = await signIn(formData);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-medium tracking-tight text-[#111111]">
              Sign In
            </h1>
            <p className="mt-2 text-sm text-[#111111]/60">
              Access your brand asset portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#111111] mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                className="w-full rounded-sm border border-[#e5e5e5] bg-white px-4 py-2.5 text-sm text-[#111111] focus:border-[#111111] focus:outline-none transition-colors"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#111111] mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                className="w-full rounded-sm border border-[#e5e5e5] bg-white px-4 py-2.5 text-sm text-[#111111] focus:border-[#111111] focus:outline-none transition-colors"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-sm border border-[#111111] bg-[#111111] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#111111]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#111111]/50">
          Brand Asset Portal
        </p>
      </div>
    </div>
  );
}

