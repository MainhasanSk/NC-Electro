'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  Layers,
  Search
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { localStore } from '@/lib/api/store';
import { Order, OrderStatus } from '@/types';
import { ORDER_STATUS_CONFIG } from '@/lib/constants/orderStatus';

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'month'>('all');

  useEffect(() => {
    setOrders(localStore.getOrders());
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = 
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.seller_supplier_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.accepted_by_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.pincode.includes(searchQuery);

    let matchesDate = true;
    const orderDate = new Date(o.created_at);
    const now = new Date();
    if (dateFilter === 'today') {
      matchesDate = orderDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'month') {
      matchesDate = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const totalReportValue = filteredOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalDeliveredValue = filteredOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const downloadCSV = () => {
    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Phone',
      'Pincode',
      'Items Count',
      'Subtotal',
      'Tax (GST)',
      'Total Order Value',
      'Status',
      'Accepted By (Sub-Admin)',
      'Seller / Supplier'
    ];

    const rows = filteredOrders.map(o => [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toISOString().slice(0, 10)}"`,
      `"${o.customer_name}"`,
      `"${o.customer_phone}"`,
      `"${o.address.pincode}"`,
      o.items.reduce((sum, i) => sum + i.quantity, 0),
      o.subtotal,
      o.tax,
      o.total,
      `"${o.status}"`,
      `"${o.accepted_by_name || 'Unassigned'}"`,
      `"${o.seller_supplier_name || 'Unallocated'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NC_Electro_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Reports & Export" subtitle="Generate regulatory dispatch audits, GST summaries & order ledgers" />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Top Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Operations & Tax Audit Register</h2>
              <p className="text-xs text-slate-400 mt-1">
                Filter and export itemized records for Guwahati sales and supplier fulfillment.
              </p>
            </div>

            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Register</span>
            </button>
          </div>

          {/* Metric Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Filtered Orders</span>
              <div className="text-3xl font-black text-white mt-1">{filteredOrders.length}</div>
              <span className="text-xs text-slate-400 mt-1 block">Active matching records</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Filtered Order Value</span>
              <div className="text-3xl font-black text-blue-400 mt-1">₹{totalReportValue.toLocaleString('en-IN')}</div>
              <span className="text-xs text-slate-400 mt-1 block">Excluding cancelled orders</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Delivered Order Value</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">₹{totalDeliveredValue.toLocaleString('en-IN')}</div>
              <span className="text-xs text-slate-400 mt-1 block">Completed physical handovers</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order #, customer, supplier..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Order Statuses</option>
                  <option value="order_placed">Order Placed (Unaccepted)</option>
                  <option value="accepted">Accepted by Sub-Admin</option>
                  <option value="processing">Processing</option>
                  <option value="ready_for_dispatch">Ready for Dispatch</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <select
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Date: All Records</option>
                  <option value="today">Date: Today Only</option>
                  <option value="month">Date: Current Month</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Guwahati Pin</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">GST (18%)</th>
                    <th className="py-3 px-4">Order Value</th>
                    <th className="py-3 px-4">Sub-Admin</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-slate-400 font-sans">
                        No orders match the specified report criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => {
                      const cfg = ORDER_STATUS_CONFIG[o.status] || { label: o.status, badgeClass: 'bg-slate-800 text-slate-300' };
                      return (
                        <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-blue-400">{o.order_number}</td>
                          <td className="py-3 px-4 text-slate-400">
                            {new Date(o.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-4 font-sans font-semibold text-white">{o.customer_name}</td>
                          <td className="py-3 px-4 text-slate-300">{o.address.pincode}</td>
                          <td className="py-3 px-4 text-slate-300">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                          <td className="py-3 px-4 text-slate-400">₹{o.tax.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 font-sans text-slate-300">{o.accepted_by_name || '—'}</td>
                          <td className="py-3 px-4 font-sans">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.badgeClass}`}>
                              {cfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
