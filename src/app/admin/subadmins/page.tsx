'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Check, 
  Lock, 
  User, 
  ShieldCheck, 
  KeyRound,
  X
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';

interface SubAdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  permissions: string[];
}

const ALL_PERMISSION_KEYS = [
  { key: 'orders.view_all', label: 'View All Unaccepted & Active Orders', group: 'Orders' },
  { key: 'orders.accept', label: 'Accept New Orders (First-Accept Race)', group: 'Orders' },
  { key: 'orders.view_assigned', label: 'View Own Assigned Orders', group: 'Orders' },
  { key: 'orders.assign_seller_supplier', label: 'Allocate Internal Stockist / Supplier', group: 'Orders' },
  { key: 'orders.update_status', label: 'Advance Order Lifecycle Statuses', group: 'Orders' },
  { key: 'products.read', label: 'View Product Master Catalog', group: 'Catalog' },
  { key: 'stock.read', label: 'View Inventory & Low-Stock Alerts', group: 'Stock' },
  { key: 'seller_suppliers.read', label: 'View Internal Stockist Directory', group: 'Suppliers' },
  { key: 'invoices.download', label: 'Download Generated Tax Invoices', group: 'Invoices' },
  { key: 'rewards.read_own', label: 'View Own Reward Points Ledger', group: 'Rewards' },
];

export default function AdminSubAdminsPage() {
  const { toast } = useToast();

  const [subAdmins, setSubAdmins] = useState<SubAdminProfile[]>([
    {
      id: 'sub-1',
      name: 'Pranab Saikia',
      email: 'pranab.ops@ncelectro.in',
      phone: '9864098765',
      is_active: true,
      permissions: [
        'orders.view_all',
        'orders.accept',
        'orders.view_assigned',
        'orders.assign_seller_supplier',
        'orders.update_status',
        'products.read',
        'stock.read',
        'seller_suppliers.read',
        'invoices.download',
        'rewards.read_own',
      ],
    },
    {
      id: 'sub-2',
      name: 'Dhruba Jyoti Kalita',
      email: 'dhruba.dispatch@ncelectro.in',
      phone: '9864077661',
      is_active: true,
      permissions: [
        'orders.view_all',
        'orders.accept',
        'orders.view_assigned',
        'orders.update_status',
        'rewards.read_own',
      ],
    }
  ]);

  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdminProfile | null>(subAdmins[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const togglePermission = (permKey: string) => {
    if (!selectedSubAdmin) return;
    const hasPerm = selectedSubAdmin.permissions.includes(permKey);
    const updatedPerms = hasPerm
      ? selectedSubAdmin.permissions.filter(p => p !== permKey)
      : [...selectedSubAdmin.permissions, permKey];

    const updated = subAdmins.map(s => {
      if (s.id === selectedSubAdmin.id) {
        return { ...s, permissions: updatedPerms };
      }
      return s;
    });

    setSubAdmins(updated);
    setSelectedSubAdmin({ ...selectedSubAdmin, permissions: updatedPerms });
    toast(`Permission ${hasPerm ? 'revoked' : 'granted'}.`, 'info');
  };

  const handleCreateSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPhone) {
      toast('Please fill all fields.', 'error');
      return;
    }

    const created: SubAdminProfile = {
      id: `sub-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      is_active: true,
      permissions: ['orders.view_all', 'orders.accept', 'orders.view_assigned', 'orders.update_status', 'rewards.read_own'],
    };

    const updated = [...subAdmins, created];
    setSubAdmins(updated);
    setSelectedSubAdmin(created);
    setShowAddModal(false);
    toast(`Sub-Admin account created for ${newName}`, 'success');
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          title="Sub-Admin Governance & Granular Permissions" 
          subtitle="Configure operational credentials and access scopes for Guwahati fulfillment managers"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Select a Sub-Admin below to view and toggle their active operational permissions.
            </p>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Sub-Admin</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 4 Cols: Sub-Admins List */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-950 text-sm pb-3 border-b border-slate-100">
                Guwahati Operations Managers
              </h3>

              <div className="space-y-2">
                {subAdmins.map(sub => {
                  const isSelected = selectedSubAdmin?.id === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubAdmin(sub)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-xs">{sub.name}</div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{sub.email}</div>
                      <div className="text-[10px] text-blue-600 font-semibold mt-1">
                        {sub.permissions.length} active permissions
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 8 Cols: Permissions Checklist (LLD Section 8.3 & Spec Section 63) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              {selectedSubAdmin ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Editing Permissions</span>
                      <h3 className="text-lg font-black text-slate-950">{selectedSubAdmin.name}</h3>
                      <div className="text-xs text-slate-500">{selectedSubAdmin.email} • {selectedSubAdmin.phone}</div>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                      <KeyRound className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Standard Operational Permissions
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {ALL_PERMISSION_KEYS.map(item => {
                        const isGranted = selectedSubAdmin.permissions.includes(item.key);
                        return (
                          <div
                            key={item.key}
                            onClick={() => togglePermission(item.key)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              isGranted
                                ? 'bg-blue-50/60 border-blue-200 text-blue-950 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold">{item.label}</div>
                              <div className="text-[10px] font-mono text-slate-400">{item.key}</div>
                            </div>

                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                isGranted ? 'bg-blue-600 text-white' : 'border border-slate-300'
                              }`}
                            >
                              {isGranted && <Check className="w-4 h-4" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Select a Sub-Admin to configure permissions.
                </div>
              )}
            </div>

          </div>

        </main>
      </div>

      {/* Create Sub-Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-950">Add Sub-Admin Manager</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleCreateSubAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Ranjit Gogoi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal Operations Email *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="ranjit.ops@ncelectro.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone (Assam) *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="9864011223"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Create Manager Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
