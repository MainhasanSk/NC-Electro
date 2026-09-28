'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ChevronRight, Check, AlertCircle, Shield } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const { user, role, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast('Please fill all profile fields.', 'error');
      return;
    }

    updateProfile({ full_name: name, email, phone });
    setSaved(true);
    toast('Profile updated successfully.', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/account" className="hover:text-blue-600">Account</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Profile Settings</span>
          </nav>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
            <div className="pb-6 border-b border-slate-100">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Profile Settings
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Update your contact details for Guwahati order notifications and warranty registration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Immutable Backend Security Notice (LLD Section 9.4) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-slate-600">
                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-800">System Role & Authorization</div>
                  <p className="text-[11px] leading-relaxed">
                    Your current system role is <strong className="font-mono text-blue-700 uppercase">{role}</strong>. In accordance with LLD security specifications, account role and administrative status are backend-governed and cannot be altered from customer profile forms.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Update Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
