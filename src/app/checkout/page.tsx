'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  AlertCircle,
  Zap,
  Info,
  Wrench
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { Address } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { localStore } from '@/lib/api/store';
import { createOrder } from '@/lib/api/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [customerNote, setCustomerNote] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addInstallation, setAddInstallation] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  // New address form state
  const [newLabel, setNewLabel] = useState('Home');
  const [newName, setNewName] = useState(user?.full_name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('Guwahati');
  const [newState, setNewState] = useState('Assam');
  const [newPincode, setNewPincode] = useState('781005');

  useEffect(() => {
    const list = localStore.getAddresses();
    setAddresses(list);
    if (list.length > 0) {
      const def = list.find(a => a.is_default) || list[0];
      setSelectedAddressId(def.id);
    } else {
      setShowNewAddressForm(true);
    }
  }, []);

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPincode || newPincode.length !== 6 || !/^\d{6}$/.test(newPincode)) {
      toast('Please enter a valid 6-digit Indian pincode.', 'error');
      return;
    }
    if (!newName || !newPhone || !newLine1) {
      toast('Please fill all required address fields.', 'error');
      return;
    }

    const created: Address = {
      id: `addr-${Date.now()}`,
      user_id: user?.id || 'guest',
      label: newLabel,
      recipient_name: newName,
      phone: newPhone,
      address_line1: newLine1,
      city: newCity,
      state: newState,
      pincode: newPincode,
      is_default: addresses.length === 0,
    };

    const updated = [...addresses, created];
    setAddresses(updated);
    localStore.saveAddresses(updated);
    setSelectedAddressId(created.id);
    setShowNewAddressForm(false);
    toast('Delivery address added successfully.', 'success');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast('Please select or add a delivery address in Guwahati.', 'warning');
      return;
    }

    if (items.length === 0) {
      toast('Your cart is empty.', 'error');
      router.push('/products');
      return;
    }

    setSubmitting(true);
    try {
      const idempotencyKey = `idemp-${Date.now()}-${Math.random()}`;
      const order = await createOrder({
        address_id: selectedAddressId,
        customer_note: customerNote.trim() || undefined,
        has_installation: addInstallation,
      }, idempotencyKey);

      router.push(`/checkout/success?order_id=${order.id}`);
    } catch (err: any) {
      toast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const installationFee = addInstallation ? 499 : 0;
  const finalPayableTotal = summary.total + installationFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <StoreHeader />
        <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl text-center border border-slate-200 space-y-4">
          <h2 className="text-xl font-black text-slate-900">Your cart is empty</h2>
          <p className="text-xs text-slate-500">Add electronics products to your cart before proceeding to checkout.</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs">
            Browse Products
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/account/cart" className="hover:text-blue-600">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Checkout</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              CHECKOUT
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Confirm your Guwahati delivery details &amp; optional on-site installation support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Steps Column */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Step 1: Delivery Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      1
                    </div>
                    <h2 className="text-lg font-black text-slate-950">Delivery Address in Guwahati</h2>
                  </div>

                  {!showNewAddressForm && (
                    <button
                      onClick={() => setShowNewAddressForm(true)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New</span>
                    </button>
                  )}
                </div>

                {/* Saved Address Cards */}
                {!showNewAddressForm && addresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map(addr => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {addr.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div className="font-bold text-sm text-slate-900">{addr.recipient_name}</div>
                          <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {addr.address_line1}, {addr.city}, {addr.state} - <strong className="text-slate-900 font-mono">{addr.pincode}</strong>
                          </div>
                          <div className="text-xs text-slate-500 mt-2 font-medium">
                            Phone: {addr.phone}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* New Address Form */}
                {showNewAddressForm && (
                  <form onSubmit={handleAddNewAddress} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Address Label</label>
                        <select
                          value={newLabel}
                          onChange={e => setNewLabel(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                        >
                          <option value="Home">Home</option>
                          <option value="Office / Commercial">Office / Commercial</option>
                          <option value="Warehouse">Warehouse</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Name *</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          placeholder="e.g. Bhaskar Jyoti Das"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={newPhone}
                          onChange={e => setNewPhone(e.target.value)}
                          placeholder="10-digit Indian Mobile"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Guwahati Pincode (6 digits) *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newPincode}
                          onChange={e => setNewPincode(e.target.value)}
                          placeholder="e.g. 781005"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Locality *</label>
                      <input
                        type="text"
                        required
                        value={newLine1}
                        onChange={e => setNewLine1(e.target.value)}
                        placeholder="House / Flat No., Road Name, Landmark (e.g. Zoo Road, Beltola)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700"
                      >
                        Save &amp; Use Address
                      </button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowNewAddressForm(false)}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Step 2: Professional Installation Service */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-950">Professional Installation Support</h2>
                      <p className="text-xs text-slate-500">Certified technician on-site setup, mounting &amp; calibration</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    ₹499 Fixed Charge
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Option A: With Installation */}
                  <div
                    onClick={() => setAddInstallation(true)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      addInstallation
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Wrench className="w-4 h-4 text-blue-600" />
                          <span>Add Professional Installation</span>
                        </span>
                        {addInstallation && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Physical mounting, wiring safety checks, inverter/battery load test, and CCTV app pairing by certified NC Electro technicians.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-blue-100/80 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>30-Day Guarantee</span>
                      </span>
                      <span className="font-mono font-black text-blue-700">+₹499</span>
                    </div>
                  </div>

                  {/* Option B: Delivery Only */}
                  <div
                    onClick={() => setAddInstallation(false)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      !addInstallation
                        ? 'border-slate-800 bg-slate-50/80 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Doorstep Delivery Only
                        </span>
                        {!addInstallation && <CheckCircle2 className="w-5 h-5 text-slate-800" />}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        We safely transport the genuine boxed electronics to your doorstep in Guwahati. You or your local electrician will handle physical setup.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-200 text-xs flex items-center justify-between">
                      <span className="text-slate-500 font-medium">No technician scheduled</span>
                      <span className="font-mono font-bold text-slate-600">₹0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Customer Delivery Instructions */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                    3
                  </div>
                  <h2 className="text-lg font-black text-slate-950">Delivery &amp; Installation Instructions (Optional)</h2>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Mention specific landmark cues or preferred technician arrival time slot for our Guwahati operations coordinator.
                  </label>
                  <textarea
                    rows={2}
                    value={customerNote}
                    onChange={e => setCustomerNote(e.target.value)}
                    placeholder="e.g. Please call 15 minutes before arrival. Installation technician needed after 3 PM."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              </div>

            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
              <h3 className="text-lg font-black text-slate-950 tracking-tight pb-3 border-b border-slate-100">
                Order Review
              </h3>

              {/* Item snippets */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product_id} className="flex items-center justify-between text-xs gap-2">
                    <div className="truncate">
                      <span className="font-bold text-slate-900">{item.quantity}x</span>{' '}
                      <span className="text-slate-700">{item.product.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      ₹{item.line_total.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{summary.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{summary.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery in Guwahati</span>
                  <span className="font-semibold text-emerald-600 uppercase text-xs">FREE</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Tax (18% GST Included)</span>
                  <span className="font-semibold text-slate-900">₹{summary.tax.toLocaleString('en-IN')}</span>
                </div>

                {/* Installation Service Line Item */}
                <div className="flex items-center justify-between text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                    <span>Installation Service</span>
                    {addInstallation && <span className="text-[10px] text-blue-600 font-bold">(Guwahati)</span>}
                  </span>
                  <span className={`font-semibold ${addInstallation ? 'text-blue-600' : 'text-slate-400'}`}>
                    {addInstallation ? '+₹499' : 'None (₹0)'}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <div className="text-base font-black text-slate-950">Total Payable</div>
                    <div className="text-[10px] text-slate-400">Fixed final amount upon delivery</div>
                  </div>
                  <div className="text-2xl font-black text-slate-950 font-mono">
                    ₹{finalPayableTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Scope Notice */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>V1 Direct Ordering</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your order will immediately transition to <strong>Order Placed</strong> and notify Sub-Admin coordinators in Guwahati for atomic acceptance.
                </p>
              </div>

              {/* Place Order CTA Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>CONFIRM &amp; PLACE ORDER</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
