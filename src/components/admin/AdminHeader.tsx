'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Search, MapPin, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { user, role, switchRole } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Guwahati Hub Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Guwahati Hub (Active)</span>
        </div>

        {/* Role Quick Switcher for testing */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => switchRole('super_admin')}
            className={`px-2 py-1 rounded-lg font-bold ${
              role === 'super_admin' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => switchRole('sub_admin')}
            className={`px-2 py-1 rounded-lg font-bold ${
              role === 'sub_admin' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sub-Admin
          </button>
          <button
            onClick={() => switchRole('customer')}
            className={`px-2 py-1 rounded-lg font-bold ${
              role === 'customer' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer
          </button>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden lg:block text-left leading-tight text-xs">
            <div className="font-bold text-slate-900">{user?.full_name}</div>
            <div className="text-[10px] text-slate-400 capitalize">{role.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
