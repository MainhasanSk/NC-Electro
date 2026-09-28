'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Role } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const { toast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast('Please enter your email or phone number.', 'error');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(identifier);
      toast(`Signed in as ${loggedUser.full_name}`, 'success');

      // Role redirection strictly adhering to Spec Section 64
      if (loggedUser.role === 'super_admin') {
        router.push('/admin');
      } else if (loggedUser.role === 'sub_admin') {
        router.push('/sub-admin');
      } else {
        router.push('/account');
      }
    } catch {
      toast('Login failed. Please verify your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: Role) => {
    switchRole(role);
    if (role === 'super_admin') {
      toast('Switched to Super Admin persona (Nitul Choudhury)', 'info');
      router.push('/admin');
    } else if (role === 'sub_admin') {
      toast('Switched to Operations Sub-Admin persona (Pranab Saikia)', 'info');
      router.push('/sub-admin');
    } else {
      toast('Switched to Customer persona (Bhaskar Jyoti Das)', 'info');
      router.push('/account');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-12 sm:py-20 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/30">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Sign In to NC Electro
            </h1>
            <p className="text-xs text-slate-500">
              Access orders, saved addresses, and manage equipment installations
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email or Mobile Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. bhaskar.das@example.com or 9864012345"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Personas (Evaluation Tool) */}
          <div className="pt-6 border-t border-slate-100 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              1-Click Demo Personas
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleQuickDemo('customer')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-left border border-slate-200 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">Customer Persona</div>
                  <div className="text-[11px] text-slate-500">Bhaskar Jyoti Das (Guwahati Resident)</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Customer</span>
              </button>

              <button
                onClick={() => handleQuickDemo('sub_admin')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-left border border-slate-200 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">Operations Sub-Admin</div>
                  <div className="text-[11px] text-slate-500">Pranab Saikia (First-Accept & Dispatch)</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">Sub-Admin</span>
              </button>

              <button
                onClick={() => handleQuickDemo('super_admin')}
                className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-left border border-slate-200 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">Super Admin (Founder)</div>
                  <div className="text-[11px] text-slate-500">Nitul Choudhury (Full Mission Control)</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Admin</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700">
              Register now
            </Link>
          </div>

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
