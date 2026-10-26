'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      success('Welcome back to Second Story.');
      router.push('/account');
    } else {
      error(res.error || 'Failed to sign in');
    }
  };

  const [seeding, setSeeding] = useState(false);

  const handleAutofillDemo = (demoType: 'admin' | 'customer') => {
    if (demoType === 'admin') {
      setEmail('admin@secondstory.com');
      setPassword('Admin@123456');
    } else {
      setEmail('customer@secondstory.com');
      setPassword('Customer@123456');
    }
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Demo accounts and 25 vintage pieces created!');
        handleAutofillDemo('admin');
      } else {
        error(data.hint || data.error || 'Failed to seed database');
      }
    } catch (err: any) {
      error(err?.message || 'Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-sm border border-[#E8E2D8] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3D4A3C]">
            Second Story Account
          </span>
          <h1 className="font-serif-editorial text-3xl text-[#1A1816]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#5C564E]">
            Sign in to access your order history, saved addresses, and wishlist.
          </p>
        </div>

        {/* Quick Demo Credentials for Reviewers */}
        <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8] rounded-sm text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-[#1A1816] text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D4A3C]" />
              <span>Instant Demo Logins</span>
            </div>
            <button
              type="button"
              onClick={handleSeedDemo}
              disabled={seeding}
              className="text-[10px] text-[#A34E36] hover:underline font-semibold disabled:opacity-50"
            >
              {seeding ? 'Seeding...' : 'Seed Database'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAutofillDemo('admin')}
              className="py-1.5 px-2 bg-white border border-[#E8E2D8] text-[11px] font-medium text-[#1A1816] hover:border-[#3D4A3C] transition rounded-xs"
            >
              Fill Curator Admin
            </button>
            <button
              type="button"
              onClick={() => handleAutofillDemo('customer')}
              className="py-1.5 px-2 bg-white border border-[#E8E2D8] text-[11px] font-medium text-[#1A1816] hover:border-[#3D4A3C] transition rounded-xs"
            >
              Fill Test Customer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#7A7268] hover:text-[#1A1816]"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase hover:bg-[#3D4A3C] transition rounded-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E8E2D8] text-center text-xs text-[#5C564E]">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/register" className="font-semibold text-[#1A1816] hover:text-[#3D4A3C] underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
