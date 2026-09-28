'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Truck,
  Layers,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DashboardStats, getDashboardStats, getCategoryPerformance } from '@/lib/api/admin/analytics';
import { getAdminOrders } from '@/lib/api/admin/orders';
import { Order } from '@/types';
import { ORDER_STATUS_CONFIG } from '@/lib/constants/orderStatus';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [categoriesPerf, setCategoriesPerf] = useState<{ category: string; units: number; order_value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [s, orders, perf] = await Promise.all([
          getDashboardStats(),
          getAdminOrders(),
          getCategoryPerformance(),
        ]);
        setStats(s);
        setRecentOrders(orders.slice(0, 5));
        setCategoriesPerf(perf);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          title="Mission Control Dashboard" 
          subtitle="Real-time Guwahati sales, order fulfillment, and operational inventory"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          
          {/* Greeting Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Guwahati Operations
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Good morning, NC Electro Executive Team
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Real-time snapshot across orders, stock allocations, and local technician assignments in Assam.
              </p>
            </div>

            {stats && stats.unacceptedOrdersCount > 0 && (
              <Link
                href="/admin/orders?status=order_placed&accepted=false"
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 shrink-0 animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{stats.unacceptedOrdersCount} Unaccepted Order(s) Waiting</span>
              </Link>
            )}
          </div>

          {/* KPI Cards Grid (Spec Section 35 & 48) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            
            {/* Total Orders */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stats?.totalOrders ?? '...'}
              </div>
              <div className="text-[10px] text-slate-400">Cumulative customer orders</div>
            </div>

            {/* Total Order Value */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Order Value</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₹{stats ? stats.totalOrderValue.toLocaleString('en-IN') : '...'}
              </div>
              <div className="text-[10px] text-slate-400">Non-cancelled order value</div>
            </div>

            {/* Active Orders */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active In Progress</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">
                {stats?.activeOrders ?? '...'}
              </div>
              <div className="text-[10px] text-slate-400">Processing to Out for Delivery</div>
            </div>

            {/* Delivered */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Delivered</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {stats?.deliveredOrders ?? '...'}
              </div>
              <div className="text-[10px] text-slate-400">Fulfilled & reward earned</div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">
                {stats?.lowStockCount ?? '...'}
              </div>
              <div className="text-[10px] text-slate-400">Items below reorder limit</div>
            </div>

            {/* Out of Stock */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Out of Stock</span>
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600">
                {stats?.outOfStockCount ?? '...'}
              </div>
              <div className="text-[10px] text-slate-400">0 inventory available</div>
            </div>

          </div>

          {/* Performance Charts & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Category Performance Breakdown */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">Category Performance</h3>
                  <p className="text-[11px] text-slate-500">Gross order value by category in Guwahati</p>
                </div>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-4 pt-2">
                {categoriesPerf.map(c => {
                  const maxVal = Math.max(...categoriesPerf.map(p => p.order_value), 1);
                  const pct = Math.round((c.order_value / maxVal) * 100);
                  return (
                    <div key={c.category} className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{c.category}</span>
                        <div className="space-x-2">
                          <span className="text-slate-400">{c.units} units</span>
                          <span className="font-black text-slate-950">₹{c.order_value.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Operational Jump Hub */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">Fulfillment Fast Actions</h3>
                  <p className="text-[11px] text-slate-500">Key modules for Guwahati logistics dispatch</p>
                </div>
                <Wrench className="w-4 h-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/admin/orders"
                  className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 hover:border-blue-400 transition-colors space-y-1"
                >
                  <div className="font-bold text-blue-900 text-xs">Order Management</div>
                  <div className="text-[11px] text-blue-700">Assign suppliers & track delivery status</div>
                </Link>

                <Link
                  href="/admin/stock"
                  className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 transition-colors space-y-1"
                >
                  <div className="font-bold text-purple-900 text-xs">Stock Adjustments</div>
                  <div className="text-[11px] text-purple-700">Update in-stock quantities & thresholds</div>
                </Link>

                <Link
                  href="/admin/seller-suppliers"
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 transition-colors space-y-1"
                >
                  <div className="font-bold text-emerald-900 text-xs">Stockists & Suppliers</div>
                  <div className="text-[11px] text-emerald-700">Manage internal supplier contacts in Guwahati</div>
                </Link>

                <Link
                  href="/sub-admin"
                  className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 hover:border-indigo-400 transition-colors space-y-1"
                >
                  <div className="font-bold text-indigo-900 text-xs">Sub-Admin Operations</div>
                  <div className="text-[11px] text-indigo-700">First-accept race queue & fast dispatch</div>
                </Link>
              </div>
            </div>

          </div>

          {/* Recent Orders Operations Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-950 text-base">Recent Orders Stream</h3>
                <p className="text-xs text-slate-500">Live order queue from customer storefront</p>
              </div>
              <Link href="/admin/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View all orders →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Pincode</th>
                    <th className="pb-3">Value</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Accepted By</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map(ord => {
                    const meta = ORDER_STATUS_CONFIG[ord.status] || ORDER_STATUS_CONFIG['order_placed'];
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900">{ord.order_number}</td>
                        <td className="py-3 font-medium text-slate-800">{ord.customer_name}</td>
                        <td className="py-3 font-mono text-slate-600">{ord.address.pincode}</td>
                        <td className="py-3 font-bold text-slate-950">₹{ord.total.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${meta.badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                            <span>{meta.label}</span>
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">
                          {ord.accepted_by_name || <span className="text-amber-600 italic">Unaccepted</span>}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/admin/orders/${ord.id}`}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
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
