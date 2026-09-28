'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, ArrowRight, ShoppingBag, MapPin, Truck, ShieldCheck, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { Order } from '@/types';
import { getOrderById } from '@/lib/api/orders';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    if (orderId) {
      getOrderById(orderId).then(o => setOrder(o));
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl text-center space-y-6">
            
            {/* Animated Big Green Checkmark */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Order Received in Guwahati Hub
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                ORDER PLACED SUCCESSFULLY
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Thank you! Your order has been registered in our system and is now staged for acceptance by an authorized Guwahati operations manager.
              </p>
            </div>

            {/* Order Highlight Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Order Number</div>
                  <div className="text-base font-black text-slate-950 font-mono">
                    {order ? order.order_number : 'NC-2026-PENDING'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Value</div>
                  <div className="text-base font-black text-blue-600">
                    ₹{order ? order.total.toLocaleString('en-IN') : '...'}
                  </div>
                </div>
              </div>

              {order?.has_installation && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Professional Installation Service Included</span>
                  </div>
                  <span className="font-bold text-blue-700 font-mono">+₹{order.installation_fee || 499}</span>
                </div>
              )}

              {order?.address && (
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Delivery Address</span>
                  </div>
                  <div>
                    {order.address.recipient_name} — {order.address.address_line1}, {order.address.city}, {order.address.state} (Pincode: <strong>{order.address.pincode}</strong>)
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps Visual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Fast Local Dispatch</div>
                  <div className="text-slate-500 mt-0.5">Assigned to Guwahati logistics fleet for same-day delivery.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">
                    {order?.has_installation ? 'Certified Technician Dispatch' : 'Installation Support'}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {order?.has_installation
                      ? 'Technician dispatched with your order for on-site mounting & testing.'
                      : 'Doorstep delivery only. Reach out anytime if you need future support.'}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {order && (
                <Link
                  href={`/account/orders/${order.id}`}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <span>TRACK ORDER STATUS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <Link
                href="/products"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                CONTINUE SHOPPING
              </Link>
            </div>

          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
