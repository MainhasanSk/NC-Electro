'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Mail, 
  ShoppingBag, 
  Calendar,
  X,
  ExternalLink
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { localStore } from '@/lib/api/store';
import { User, Order, Address } from '@/types';
import Link from 'next/link';
import { MOCK_USERS } from '@/lib/mockData';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  useEffect(() => {
    // Filter only customer role
    const allUsers = MOCK_USERS.filter(u => u.role === 'customer');
    setCustomers(allUsers);
    setOrders(localStore.getOrders());
  }, []);

  const customerStats = customers.map(cust => {
    const custOrders = orders.filter(o => o.user_id === cust.id || o.customer_email.toLowerCase() === cust.email.toLowerCase());
    const totalSpent = custOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
    const lastOrder = custOrders.length > 0 
      ? custOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] 
      : null;

    return {
      ...cust,
      orderCount: custOrders.length,
      totalSpent,
      lastOrder,
      orders: custOrders
    };
  });

  const filteredCustomers = customerStats.filter(c => {
    const matchesSearch = 
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && c.is_active) || 
      (statusFilter === 'inactive' && !c.is_active);

    return matchesSearch && matchesStatus;
  });

  const totalRegistered = customers.length;
  const activeCount = customers.filter(c => c.is_active).length;
  const totalCustomerOrderValue = customerStats.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Customer Directory" subtitle="Manage registered retail accounts, address profiles & lifetime order volume" />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Customers</span>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-white">{totalRegistered}</div>
              <div className="text-xs text-slate-400 mt-2">Active retail profiles in Guwahati</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Status</span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-emerald-400">{activeCount}</div>
              <div className="text-xs text-slate-400 mt-2">100% verified mobile accounts</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Customer Order Value</span>
                <ShoppingBag className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white">₹{totalCustomerOrderValue.toLocaleString('en-IN')}</div>
              <div className="text-xs text-slate-400 mt-2">Calculated order volume across all customers</div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      statusFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({customers.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      statusFilter === 'active' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setStatusFilter('inactive')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      statusFilter === 'inactive' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Contact Details</th>
                    <th className="py-4 px-6">Registered</th>
                    <th className="py-4 px-6">Orders</th>
                    <th className="py-4 px-6">Total Order Value</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                        No customer accounts match your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(cust => (
                      <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white text-base">{cust.full_name}</div>
                          <div className="text-xs text-slate-400 font-mono">ID: {cust.id}</div>
                        </td>
                        <td className="py-4 px-6 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cust.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>+91 {cust.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400">
                          {new Date(cust.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-white">{cust.orderCount}</span>
                          <span className="text-xs text-slate-400 ml-1">orders</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-emerald-400">
                          ₹{cust.totalSpent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6">
                          {cust.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold border border-blue-500/30 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View History</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Customer Detail Drawer */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedCustomer.full_name}</h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Account ID: {selectedCustomer.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & Registration</div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Email Address</span>
                      <span className="font-semibold text-white">{selectedCustomer.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Phone Number</span>
                      <span className="font-semibold text-white">+91 {selectedCustomer.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Registration Date</span>
                      <span className="font-semibold text-white">
                        {new Date(selectedCustomer.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Account Status</span>
                      <span className="text-emerald-400 font-bold">Verified Retail User</span>
                    </div>
                  </div>
                </div>

                {/* Orders History */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Order History</h3>
                    <span className="text-xs text-slate-400">
                      {customerStats.find(c => c.id === selectedCustomer.id)?.orders.length || 0} Total Orders
                    </span>
                  </div>

                  <div className="space-y-3">
                    {customerStats.find(c => c.id === selectedCustomer.id)?.orders.map(order => (
                      <div key={order.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-blue-400 text-sm">{order.order_number}</span>
                            <span className="text-xs text-slate-400 ml-2">
                              {new Date(order.created_at).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {order.items.map(item => (
                            <div key={item.id} className="text-xs flex justify-between text-slate-300">
                              <span>{item.quantity}x {item.product_name}</span>
                              <span className="font-mono text-white">₹{item.line_total.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Order Value (incl. GST):</span>
                          <span className="font-bold text-white font-mono">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="pt-1 flex justify-end">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            <span>Open in Order Dispatch</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
