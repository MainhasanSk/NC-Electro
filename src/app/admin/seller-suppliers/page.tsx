'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  X,
  Info
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SellerSupplier } from '@/types';
import { getSellerSuppliers, createSellerSupplier, updateSellerSupplier } from '@/lib/api/admin/suppliers';
import { useToast } from '@/context/ToastContext';

export default function AdminSellerSuppliersPage() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<SellerSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pincode, setPincode] = useState('781005');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const sups = await getSellerSuppliers();
      setSuppliers(sups);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !phone || !pincode || pincode.length !== 6) {
      toast('Please enter valid supplier details and a 6-digit pincode.', 'error');
      return;
    }

    try {
      await createSellerSupplier({
        business_name: businessName,
        contact_person: contactPerson,
        phone,
        email,
        city: 'Guwahati',
        pincode,
        is_active: true,
        notes: notes || undefined,
        supported_categories: ['CCTV & Security', 'Inverters & UPS', 'Batteries'],
      });

      toast(`Seller/Supplier "${businessName}" added to master records.`, 'success');
      setShowModal(false);
      loadData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleToggleActive = async (sup: SellerSupplier) => {
    try {
      await updateSellerSupplier(sup.id, { is_active: !sup.is_active });
      toast(`Supplier ${!sup.is_active ? 'activated' : 'deactivated'}.`, 'info');
      loadData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const filtered = suppliers.filter(s => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.business_name.toLowerCase().includes(q) ||
        s.pincode.includes(q) ||
        s.contact_person.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          title="Seller / Supplier Master Records" 
          subtitle="Internal registry of wholesale electronics stockists & warehouse partners across Guwahati"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Strict V1 Scope Policy Banner (Spec Section 39 & 53) */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-bold">V1 Architecture Boundary:</strong>
              <p className="text-[11px] leading-relaxed">
                Seller/Supplier records are stored as internal master data for dispatch coordination and historical reporting only. In accordance with approved HLD/LLD specifications, <strong>no external seller login, seller portal, or automated distance assignment</strong> exists in V1.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by business name or pincode..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stockist Record</span>
            </button>
          </div>

          {/* Suppliers Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Stockist Business</th>
                    <th className="pb-3">Contact Person</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Guwahati Pincode</th>
                    <th className="pb-3">Supported Categories</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(sup => (
                    <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{sup.business_name}</div>
                        <div className="text-[10px] text-slate-400">{sup.notes || 'Guwahati Partner'}</div>
                      </td>
                      <td className="py-3 text-slate-800 font-medium">{sup.contact_person}</td>
                      <td className="py-3 font-mono text-slate-600">{sup.phone}</td>
                      <td className="py-3 font-mono font-bold text-blue-700">{sup.pincode}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {sup.supported_categories.map((c, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          sup.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {sup.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleActive(sup)}
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            sup.is_active ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {sup.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Create Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-950">Add Guwahati Stockist Record</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="e.g. Kamakhya Surveillance Systems"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Gautam Kalita"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit phone"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="supplier@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guwahati Pincode (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="e.g. 781001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal Operational Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Primary stockist for Luminous batteries in Beltola corridor..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Save Supplier Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
