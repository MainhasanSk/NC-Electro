'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  History, 
  Info,
  Calendar,
  Search,
  ExternalLink
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { localStore } from '@/lib/api/store';
import { RewardPoint } from '@/types';
import Link from 'next/link';

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<RewardPoint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setRewards(localStore.getRewards());
  }, []);

  const filteredRewards = rewards.filter(r => 
    r.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by Sub-Admin
  const subAdminSummary = rewards.reduce((acc, r) => {
    if (!acc[r.user_name]) {
      acc[r.user_name] = { name: r.user_name, points: 0, orderCount: 0 };
    }
    acc[r.user_name].points += r.points;
    acc[r.user_name].orderCount += 1;
    return acc;
  }, {} as Record<string, { name: string; points: number; orderCount: number }>);

  const totalPoints = rewards.reduce((sum, r) => sum + r.points, 0);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Sub-Admin Rewards" subtitle="Append-only operational performance ledger & fulfillment incentives" />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* LLD Regulatory Compliance Banner */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-blue-300 uppercase tracking-wide block">
                V1 Strict Operational Rule: Append-Only Recognition Points
              </span>
              <p className="text-slate-300 leading-relaxed">
                As per LLD Section 10 and Frontend Spec Section 38, exactly <strong>1 reward point</strong> is automatically awarded to the responsible Sub-Admin upon reaching the <code>delivered</code> status. Reward redemption, cashouts, and manual point adjustments are strictly out of scope for V1. This ledger serves as an immutable operational audit log.
              </p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Total Points Awarded</span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400">{totalPoints}</div>
              <div className="text-xs text-slate-400">1 point per successful customer handover</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Active Sub-Admins</span>
                <UserCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white">{Object.keys(subAdminSummary).length}</div>
              <div className="text-xs text-slate-400">Staff with active fulfillment records</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Audit Integrity</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Immutable ledger backed by order timestamps</div>
            </div>
          </div>

          {/* Leaderboard & Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Sub-Admin Fulfillment Leaderboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(subAdminSummary).map((s, idx) => (
                <div key={s.name} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30 text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.orderCount} Orders Delivered</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-amber-400">{s.points} pts</div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Recognized</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Audit Ledger Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Immutable Reward Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">Chronological record of earned fulfillment points</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order or sub-admin..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Event ID</th>
                    <th className="py-3 px-4">Sub-Admin</th>
                    <th className="py-3 px-4">Order Reference</th>
                    <th className="py-3 px-4">Points</th>
                    <th className="py-3 px-4">Reason / Stage</th>
                    <th className="py-3 px-4">Awarded Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredRewards.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 font-sans">
                        No reward audit events recorded.
                      </td>
                    </tr>
                  ) : (
                    filteredRewards.map(r => (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-slate-500">{r.id}</td>
                        <td className="py-3 px-4 font-sans font-bold text-white">{r.user_name}</td>
                        <td className="py-3 px-4 text-blue-400 font-bold">{r.order_number}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-800 text-[10px]">
                            +{r.points} Point
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-300">{r.reason}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(r.created_at).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                      </tr>
                    ))
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
