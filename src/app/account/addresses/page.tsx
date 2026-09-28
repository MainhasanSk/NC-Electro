'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Check, 
  ChevronRight, 
  Edit3, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { Address } from '@/types';
import { localStore } from '@/lib/api/store';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AddressesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Guwahati');
  const [state, setState] = useState('Assam');
  const [pincode, setPincode] = useState('781005');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    const list = localStore.getAddresses();
    setAddresses(list);
  }, []);

  const openAddModal = () => {
    setEditingAddress(null);
    setLabel('Home');
    setRecipientName(user?.full_name || '');
    setPhone(user?.phone || '');
    setLine1('');
    setCity('Guwahati');
    setState('Assam');
    setPincode('781005');
    setIsDefault(addresses.length === 0);
    setShowModal(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setLabel(addr.label);
    setRecipientName(addr.recipient_name);
    setPhone(addr.phone);
    setLine1(addr.address_line1);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setIsDefault(addr.is_default);
    setShowModal(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      toast('Please enter a valid 6-digit Indian postal pincode.', 'error');
      return;
    }
    if (!recipientName || !phone || !line1) {
      toast('Please fill all required fields.', 'error');
      return;
    }

    let updated: Address[];
    if (editingAddress) {
      updated = addresses.map(a => {
        if (a.id === editingAddress.id) {
          return {
            ...a,
            label,
            recipient_name: recipientName,
            phone,
            address_line1: line1,
            city,
            state,
            pincode,
            is_default: isDefault,
          };
        }
        return isDefault ? { ...a, is_default: false } : a;
      });
      toast('Address updated successfully.', 'success');
    } else {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        user_id: user?.id || 'guest',
        label,
        recipient_name: recipientName,
        phone,
        address_line1: line1,
        city,
        state,
        pincode,
        is_default: isDefault || addresses.length === 0,
      };

      updated = isDefault
        ? [...addresses.map(a => ({ ...a, is_default: false })), newAddr]
        : [...addresses, newAddr];
      toast('Address added to your account.', 'success');
    }

    setAddresses(updated);
    localStore.saveAddresses(updated);
    setShowModal(false);
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      is_default: a.id === id,
    }));
    setAddresses(updated);
    localStore.saveAddresses(updated);
    toast('Default delivery address updated.', 'success');
  };

  const handleDelete = (id: string) => {
    if (addresses.length === 1) {
      toast('You must have at least one delivery address.', 'warning');
      return;
    }
    const updated = addresses.filter(a => a.id !== id);
    if (!updated.some(a => a.is_default) && updated.length > 0) {
      updated[0].is_default = true;
    }
    setAddresses(updated);
    localStore.saveAddresses(updated);
    toast('Address deleted.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/account" className="hover:text-blue-600">Account</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Saved Addresses</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                DELIVERY ADDRESSES
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage your saved delivery destinations and installation sites in Guwahati.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Default
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-950">{addr.recipient_name}</h3>
                    <div className="text-xs text-slate-600 leading-relaxed mt-1">
                      {addr.address_line1}<br />
                      {addr.city}, {addr.state} — Pincode: <strong className="font-mono text-slate-900">{addr.pincode}</strong>
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-2">
                      Phone: {addr.phone}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  {!addr.is_default ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-slate-400">Primary Delivery</span>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="text-slate-600 hover:text-blue-600 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-slate-400 hover:text-rose-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Address Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-950">
                {editingAddress ? 'Edit Address' : 'Add New Guwahati Address'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Label</label>
                  <select
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Commercial Site">Commercial Site</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guwahati Pincode (6 Digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address / Locality *</label>
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={e => setLine1(e.target.value)}
                  placeholder="House No, Road, Landmark"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    disabled
                    value={city}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    disabled
                    value={state}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={e => setIsDefault(e.target.checked)}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <span className="font-semibold text-slate-700">Set as default delivery address</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <StoreFooter />
    </div>
  );
}
