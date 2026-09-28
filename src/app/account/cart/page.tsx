'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, summary, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Shopping Cart</span>
          </nav>

          <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                YOUR CART
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {items.length === 0 ? 'No items in cart' : `${items.length} unique electronics items`}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                {items.map(item => (
                  <div
                    key={item.product_id}
                    className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={item.product.primary_image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {item.product.brand}
                        </span>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="block text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 truncate transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          SKU: {item.product.sku}
                        </div>
                        <div className="text-xs text-slate-600 font-bold mt-1">
                          ₹{item.product.price.toLocaleString('en-IN')} each
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[90px]">
                        <div className="text-base font-black text-slate-950">
                          ₹{item.line_total.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">Total</div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Guwahati Local Service Info */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
                  <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Fast Local Dispatch:</strong> Items in your cart are fulfilled directly from Guwahati hubs (Zoo Road / GS Road). Orders are verified by operations managers before dispatch.
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
                <h3 className="text-lg font-black text-slate-950 tracking-tight pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{summary.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {summary.discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>Promotional Discount</span>
                      <span className="font-semibold">-₹{summary.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>Delivery in Guwahati</span>
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    <span className="font-semibold text-slate-900">
                      {summary.shipping === 0 ? (
                        <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                      ) : (
                        `₹${summary.shipping}`
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>GST (18% Included)</span>
                    <span className="font-semibold text-slate-900">₹{summary.tax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <div>
                      <div className="text-base font-black text-slate-950">Total Payable</div>
                      <div className="text-[10px] text-slate-400">Server verified price</div>
                    </div>
                    <div className="text-2xl font-black text-slate-950">
                      ₹{summary.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span>V1 Direct Ordering</span>
                  </div>
                  <p>
                    No payment gateway or card forms required. Place your order directly with your Guwahati address.
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Your cart is waiting
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Looks like you haven&apos;t added any electronics to your cart yet. Explore our genuine CCTV, inverters, and battery collections.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
