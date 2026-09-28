'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  UserCheck, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Order, OrderStatus } from '@/types';
import { getAdminOrders } from '@/lib/api/admin/orders';
import { ORDER_STATUS_CONFIG } from '@/lib/constants/orderStatus';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [pincodeFilter, setPincodeFilter] = useState('');
  const [acceptedFilter, setAcceptedFilter] = useState('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await getAdminOrders();
        setOrders(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (acceptedFilter === 'unaccepted' && o.accepted_by_id) return false;
    if (acceptedFilter === 'accepted' && !o.accepted_by_id) return false;
    if (pincodeFilter && !o.address.pincode.includes(pincodeFilter)) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          title="Orders & Dispatch Operations" 
          subtitle="Manage all customer orders across Guwahati with atomic acceptance tracking"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Controls & Filter Bar (Spec Section 36) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Order # or customer..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="order_placed">Order Placed</option>
                <option value="accepted">Accepted</option>
                <option value="processing">Processing</option>
                <option value="ready_for_dispatch">Ready for Dispatch</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>

              {/* Acceptance State */}
              <select
                value={acceptedFilter}
                onChange={e => setAcceptedFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Acceptance States</option>
                <option value="unaccepted">Unaccepted Only (Queue)</option>
                <option value="accepted">Accepted Orders</option>
              </select>

              {/* Pincode filter */}
              <input
                type="text"
                placeholder="Filter Pincode (e.g. 781005)..."
                value={pincodeFilter}
                onChange={e => setPincodeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Orders Master Data Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
              <div>
                Showing <strong>{filteredOrders.length}</strong> orders
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Pincode</th>
                    <th className="pb-3">Order Value</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Accepted By</th>
                    <th className="pb-3">Allocated Stockist</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(ord => {
                    const meta = ORDER_STATUS_CONFIG[ord.status] || ORDER_STATUS_CONFIG['order_placed'];
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 font-mono font-black text-slate-950">
                          {ord.order_number}
                        </td>
                        <td className="py-3.5">
                          <div className="font-bold text-slate-900">{ord.customer_name}</div>
                          <div className="text-[11px] text-slate-400">{ord.customer_phone}</div>
                        </td>
                        <td className="py-3.5 font-mono text-slate-600 font-medium">
                          {ord.address.pincode}
                        </td>
                        <td className="py-3.5 font-black text-slate-950">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${meta.badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                            <span>{meta.label}</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-600">
                          {ord.accepted_by_name ? (
                            <span className="font-semibold text-slate-800">{ord.accepted_by_name}</span>
                          ) : (
                            <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Unaccepted
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-600">
                          {ord.seller_supplier_name ? (
                            <span className="truncate max-w-[150px] inline-block font-medium">{ord.seller_supplier_name}</span>
                          ) : (
                            <span className="text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/admin/orders/${ord.id}`}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors"
                          >
                            Manage →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
