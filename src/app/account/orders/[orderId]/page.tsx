'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin, 
  FileText, 
  Truck, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  UserCheck,
  AlertCircle,
  PackageCheck,
  Wrench
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { Order, OrderStatus } from '@/types';
import { getOrderById } from '@/lib/api/orders';
import { 
  ORDER_LIFECYCLE_STEPS, 
  ORDER_STATUS_CONFIG, 
  OrderStatusMeta 
} from '@/lib/constants/orderStatus';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const found = await getOrderById(orderId);
        setOrder(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) {
      load();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <StoreHeader />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
        <StoreFooter />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <StoreHeader />
        <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl text-center border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-500">Could not locate an order matching ID &ldquo;{orderId}&rdquo;.</p>
          <Link href="/account/orders" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs">
            Back to Orders
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const currentMeta = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG['order_placed'];
  const currentStepIndex = currentMeta.stepIndex;

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
            <Link href="/account/orders" className="hover:text-blue-600">Orders</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">{order.order_number}</span>
          </nav>

          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Details</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${currentMeta.badgeClass}`}>
                  <span className={`w-2 h-2 rounded-full ${currentMeta.dotColor}`} />
                  <span>{currentMeta.label}</span>
                </span>
                {order.has_installation && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <Wrench className="w-3 h-3 text-blue-600" />
                    <span>Installation Requested (+₹{order.installation_fee || 499})</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                {order.order_number}
              </h1>
              <div className="text-xs text-slate-500">
                Placed on {new Date(order.created_at).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/account/orders/${order.id}/invoice`}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>View / Download Tax Invoice</span>
              </Link>
            </div>
          </div>

          {/* Section: Visual Order Status Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-950 tracking-tight">Fulfillment Journey</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentMeta.customerMessage}</p>
            </div>

            {/* Stepper / Timeline Bar */}
            <div className="relative pt-4 pb-2">
              <div className="hidden md:grid grid-cols-7 gap-2 relative">
                {/* Horizontal Progress Background Line */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0" />
                <div 
                  className="absolute top-4 left-6 h-1 bg-blue-600 transition-all duration-700 -z-0"
                  style={{
                    width: currentStepIndex >= 0 ? `${(currentStepIndex / 6) * 100}%` : '0%'
                  }}
                />

                {ORDER_LIFECYCLE_STEPS.map((stepKey, idx) => {
                  const meta = ORDER_STATUS_CONFIG[stepKey];
                  const isCompleted = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={stepKey} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md animate-pulse-subtle'
                            : 'bg-white text-slate-400 border-2 border-slate-200'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div className="mt-3 space-y-0.5">
                        <div className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {meta.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Vertical Timeline */}
              <div className="md:hidden space-y-4 pt-2">
                {ORDER_LIFECYCLE_STEPS.map((stepKey, idx) => {
                  const meta = ORDER_STATUS_CONFIG[stepKey];
                  const isCompleted = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={stepKey} className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-blue-600 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {meta.label}
                        </div>
                        <div className="text-[11px] text-slate-500">{meta.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Status History */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Status Event Log
              </h3>
              <div className="space-y-2">
                {order.status_history.map(hist => (
                  <div key={hist.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">{hist.changed_by_name}</div>
                      <div className="text-slate-600">{hist.note}</div>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono shrink-0">
                      {new Date(hist.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details & Address Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items Purchased */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-950 tracking-tight pb-3 border-b border-slate-100">
                Items in This Order
              </h2>

              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                        <Image
                          src={item.image_url}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {item.brand}
                        </span>
                        <div className="text-sm font-bold text-slate-900 leading-snug">
                          {item.product_name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          SKU: {item.sku}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-slate-950">
                        ₹{item.line_total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.quantity} x ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery in Guwahati</span>
                  <span className="font-semibold text-emerald-600 uppercase text-xs">
                    {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>GST (18% Included)</span>
                  <span className="font-semibold text-slate-900">₹{order.tax.toLocaleString('en-IN')}</span>
                </div>
                {order.has_installation && (
                  <div className="flex items-center justify-between text-blue-600 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>Professional Installation Service</span>
                    </span>
                    <span className="font-semibold text-blue-700 font-mono">
                      +₹{(order.installation_fee || 499).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-base font-black text-slate-950">Total Order Value</span>
                  <span className="text-2xl font-black text-slate-950">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address & Assigned Coordinator */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Address card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Delivery Address</span>
                </div>
                <div className="font-bold text-sm text-slate-900">{order.address.recipient_name}</div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  {order.address.address_line1}, {order.address.city}, {order.address.state} - <strong className="font-mono text-slate-900">{order.address.pincode}</strong>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Contact: {order.address.phone}
                </div>
              </div>

              {/* Operational Fulfillment Attribution */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Guwahati Operations Coordinator</span>
                </div>
                {order.accepted_by_name ? (
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-900">{order.accepted_by_name}</div>
                    <div className="text-xs text-slate-500">
                      Assigned on {order.accepted_at ? new Date(order.accepted_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'recently'}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    Order is currently waiting to be accepted by the nearest Sub-Admin manager in Guwahati.
                  </div>
                )}
              </div>

              {/* Installation Details */}
              {order.has_installation && (
                <div className="bg-white rounded-3xl p-6 border border-blue-200 bg-blue-50/20 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span>On-Site Installation Support</span>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    A certified NC Electro technician will be dispatched alongside your delivery to handle physical setup, electrical wiring checks, and device calibration.
                  </div>
                  <div className="pt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Covered under NC Electro 30-Day Guarantee</span>
                  </div>
                </div>
              )}

              {order.customer_note && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Delivery Note
                  </div>
                  <div className="text-xs text-slate-600 italic">
                    &ldquo;{order.customer_note}&rdquo;
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
