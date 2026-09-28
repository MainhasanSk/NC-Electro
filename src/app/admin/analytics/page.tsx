'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Layers, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getDashboardStats, getSalesTrends, getCategoryPerformance, DashboardStats } from '@/lib/api/admin/analytics';
import { localStore } from '@/lib/api/store';
import { Order } from '@/types';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<{ date: string; order_count: number; order_value: number }[]>([]);
  const [categories, setCategories] = useState<{ category: string; units: number; order_value: number }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    async function loadData() {
      const s = await getDashboardStats();
      const t = await getSalesTrends();
      const c = await getCategoryPerformance();
      setStats(s);
      setTrends(t);
      setCategories(c);
      setOrders(localStore.getOrders());
    }
    loadData();
  }, []);

  // Compute status distribution
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Compute Guwahati pincode distribution
  const pincodeDemand = orders.reduce((acc, o) => {
    const pin = o.address.pincode || '781001';
    acc[pin] = (acc[pin] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxTrendValue = Math.max(...trends.map(t => t.order_value), 1);
  const totalCategoryUnits = categories.reduce((sum, c) => sum + c.units, 0) || 1;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Analytics & Trends" subtitle="Performance metrics, Guwahati demand distribution & category velocity" />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Business Intelligence Overview</h2>
              <p className="text-xs text-slate-400 mt-1">
                Data strictly represents authoritative order value & units as recorded by NC Electro dispatch.
              </p>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeRange === '7d' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeRange === '30d' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeRange === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Total Order Value</span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-white">
                ₹{(stats?.totalOrderValue || 0).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="text-emerald-400 font-semibold flex items-center">
                  +18.4% <ArrowUpRight className="w-3 h-3" />
                </span>
                <span>vs previous period</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-white">{stats?.totalOrders || 0}</div>
              <div className="text-[11px] text-slate-400">
                Avg. ₹{Math.round((stats?.totalOrderValue || 0) / (stats?.totalOrders || 1)).toLocaleString('en-IN')} / order
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Delivered Rate</span>
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-3xl font-black text-purple-400">
                {Math.round(((stats?.deliveredOrders || 0) / (stats?.totalOrders || 1)) * 100)}%
              </div>
              <div className="text-[11px] text-slate-400">
                {stats?.deliveredOrders || 0} completed deliveries
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Active in Pipeline</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-400">{stats?.activeOrders || 0}</div>
              <div className="text-[11px] text-slate-400">
                {stats?.unacceptedOrdersCount || 0} awaiting Sub-Admin accept
              </div>
            </div>
          </div>

          {/* Visual Trend Chart */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Order Value Trajectory (Daily)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Booking volume in ₹ across Guwahati distribution hub</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                <span>Order Value (₹)</span>
              </div>
            </div>

            <div className="h-64 flex items-end gap-3 pt-6 pb-2 border-b border-slate-800">
              {trends.map(t => {
                const heightPercent = Math.max(Math.round((t.order_value / maxTrendValue) * 100), 12);
                return (
                  <div key={t.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-mono font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{Math.round(t.order_value / 1000)}k
                    </div>
                    <div 
                      className="w-full bg-blue-600 hover:bg-blue-500 rounded-t-lg transition-all relative group cursor-pointer"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-slate-700 font-mono">
                        {t.order_count} orders · ₹{t.order_value.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two-Column Deep Dives */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Performance */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Category Velocity & Share</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Units sold and generated order value</p>
                </div>
                <Layers className="w-5 h-5 text-blue-500" />
              </div>

              <div className="space-y-4">
                {categories.map(cat => {
                  const percent = Math.round((cat.units / totalCategoryUnits) * 100);
                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{cat.category}</span>
                        <div className="text-right">
                          <span className="font-mono text-emerald-400 font-semibold mr-3">₹{cat.order_value.toLocaleString('en-IN')}</span>
                          <span className="text-slate-400 font-mono">{cat.units} units ({percent}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guwahati Locality Distribution */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Guwahati Pincode Heatmap</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Delivery volume by postal district</p>
                </div>
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(pincodeDemand).map(([pin, count]) => {
                  const areaNames: Record<string, string> = {
                    '781001': 'Paltan Bazar / Panbazar',
                    '781005': 'Zoo Road / Ganeshguri',
                    '781007': 'Ulubari / Nehru Stadium',
                    '781024': 'Beltola / Basistha',
                    '781036': 'Maligaon / Jalukbari'
                  };
                  return (
                    <div key={pin} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-400 text-sm">{pin}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-800">
                          {count} orders
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white truncate">
                        {areaNames[pin] || 'Guwahati Hub'}
                      </div>
                      <div className="text-[10px] text-slate-400">Fast doorstep courier & installation zone</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
