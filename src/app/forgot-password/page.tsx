'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOrPhone) {
      // In accordance with LLD Section 9.2: Always return generic 202 without revealing if account exists
      setSubmitted(true);
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
              Reset Password
            </h1>
            <p className="text-xs text-slate-500">
              Enter your registered email address or phone number to receive recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto" />
              <h3 className="font-bold text-slate-950 text-sm">Request Processed</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists matching that identifier, a secure reset token has been dispatched. For security reasons, we do not confirm individual account registrations.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email or Phone Number *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter email or mobile"
                    value={emailOrPhone}
                    onChange={e => setEmailOrPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
              >
                Send Password Reset Instructions
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
