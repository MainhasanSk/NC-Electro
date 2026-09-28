'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  FileText,
  LogOut,
  Zap,
  PackageCheck
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { Order } from '@/types';
import { getCustomerOrders } from '@/lib/api/orders';
import { ORDER_STATUS_CONFIG } from '@/lib/constants/orderStatus';

export default function AccountDashboardPage() {
  const { user, role, logout } = useAuth();
  const { wishlistIds } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await getCustomerOrders(user?.id || 'guest');
        setOrders(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled', 'returned'].includes(o.status));
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Account Dashboard</span>
          </nav>

          {/* User Welcome Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Customer Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                  Welcome back, {user?.full_name || 'Valued Customer'}
                </h1>
                <div className="text-xs text-slate-500 mt-0.5">
                  {user?.email} • {user?.phone}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/account/profile"
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Edit Profile
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* KPI Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Purchases</div>
              <div className="text-3xl font-black text-slate-950">{orders.length}</div>
              <div className="text-[11px] text-slate-500">Orders placed with NC Electro</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active In Transit</div>
              <div className="text-3xl font-black text-blue-600">{activeOrders.length}</div>
              <div className="text-[11px] text-slate-500">Orders currently in fulfillment</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved For Later</div>
              <div className="text-3xl font-black text-rose-500">{wishlistIds.length}</div>
              <div className="text-[11px] text-slate-500">Items in your wishlist</div>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/account/orders"
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">Orders & Tracking</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check delivery status, technician updates, and invoices.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <span>View all orders</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/account/addresses"
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">Saved Addresses</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Manage your home, clinic, or business locations in Guwahati.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <span>Manage addresses</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/account/wishlist"
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">Saved Wishlist</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Revisit bookmarked surveillance cameras and battery systems.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <span>View wishlist ({wishlistIds.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-950">Recent Orders</h3>
                <p className="text-xs text-slate-500">Latest activity from your account</p>
              </div>
              <Link href="/account/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View all ({orders.length}) →
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map(ord => {
                  const meta = ORDER_STATUS_CONFIG[ord.status] || ORDER_STATUS_CONFIG['order_placed'];
                  return (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-slate-950">{ord.order_number}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${meta.badgeClass}`}>
                            {meta.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {ord.items.length} items • ₹{ord.total.toLocaleString('en-IN')} • {new Date(ord.created_at).toLocaleDateString('en-IN')}
                        </div>
                      </div>

                      <Link
                        href={`/account/orders/${ord.id}`}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:text-blue-600 shadow-sm self-start sm:self-auto"
                      >
                        Track Status →
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No orders placed yet.
              </div>
            )}
          </div>

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
