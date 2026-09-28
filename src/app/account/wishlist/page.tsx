'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, ChevronRight, Trash2 } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { localStore } from '@/lib/api/store';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const all = localStore.getProducts();
    const filtered = all.filter(p => wishlistIds.includes(p.id));
    setProducts(filtered);
  }, [wishlistIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/account" className="hover:text-blue-600">Account</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Wishlist</span>
          </nav>

          <div className="pb-6 border-b border-slate-200 mb-8">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              SAVED FOR LATER
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {products.length} saved electronics items in your wishlist
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Save products you love
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tap the heart icon on any CCTV, inverter, or battery to bookmark it for future purchase or installation consultation.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  <span>Explore Products</span>
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
