'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Warehouse, 
  Users, 
  Truck, 
  BarChart3, 
  FileText, 
  Award, 
  ShieldAlert, 
  Settings, 
  Zap,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const navGroups = [
    {
      title: 'Operations',
      links: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Orders & Dispatch', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Inventory & Stock', href: '/admin/stock', icon: Warehouse },
      ]
    },
    {
      title: 'Catalog & Master Data',
      links: [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Categories', href: '/admin/categories', icon: Layers },
        { label: 'Seller / Suppliers', href: '/admin/seller-suppliers', icon: Truck },
        { label: 'Customers', href: '/admin/customers', icon: Users },
      ]
    },
    {
      title: 'Intelligence & Performance',
      links: [
        { label: 'Analytics & Trends', href: '/admin/analytics', icon: BarChart3 },
        { label: 'Reports & Export', href: '/admin/reports', icon: FileText },
        { label: 'Sub-Admin Rewards', href: '/admin/rewards', icon: Award },
      ]
    },
    {
      title: 'Administration',
      links: [
        { label: 'Sub-Admins & Roles', href: '/admin/subadmins', icon: ShieldAlert },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-900 min-h-screen">
      <div>
        {/* Brand Bar */}
        <div className="p-6 border-b border-slate-900 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="font-black text-white text-base tracking-tight">NC ELECTRO</div>
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Mission Control</div>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="py-6 px-4 space-y-6 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              {group.links.map(link => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info & Back to Store */}
      <div className="p-4 border-t border-slate-900 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Logged in as</div>
          <div className="font-bold text-white truncate">{user?.full_name || 'Admin'}</div>
          <div className="text-[10px] text-purple-400 font-mono uppercase mt-0.5">{role}</div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>

          <button
            onClick={logout}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
