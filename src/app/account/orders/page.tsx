'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  Filter, 
  Search,
  FileText
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { Order, OrderStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getCustomerOrders } from '@/lib/api/orders';
import { ORDER_STATUS_CONFIG } from '@/lib/constants/orderStatus';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadOrders() {
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
    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.items.some(i => i.product_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/account" className="hover:text-blue-600">Account</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Orders & Tracking</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                MY ORDERS
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Track live fulfillment milestones, courier updates, and download tax invoices.
              </p>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Order # or product name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="order_placed">Order Placed</option>
                <option value="accepted">Accepted</option>
                <option value="processing">Processing</option>
                <option value="ready_for_dispatch">Ready for Dispatch</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500 animate-pulse text-sm">
              Loading orders...
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const statusMeta = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG['order_placed'];
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-blue-400 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Order Number
                          </div>
                          <div className="text-base font-black text-slate-950 font-mono">
                            {order.order_number}
                          </div>
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                        <div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Date Placed
                          </div>
                          <div className="text-xs font-semibold text-slate-700">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {order.has_installation && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <span>Installation Included</span>
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusMeta.badgeClass}`}>
                          <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`} />
                          <span>{statusMeta.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Items row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-8 space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3 text-xs">
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-slate-800 truncate">{item.product_name}</span>
                            <span className="text-slate-400 font-mono text-[11px]">({item.brand})</span>
                          </div>
                        ))}
                      </div>

                      <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">Order Value</div>
                          <div className="text-lg font-black text-slate-950">
                            ₹{order.total.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <Link
                          href={`/account/orders/${order.id}`}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                        >
                          <span>Track Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Your next electronics purchase will appear here
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have not placed any orders yet. Explore our genuine CCTV, inverters, and battery collections in Guwahati.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  <span>Shop Electronics</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
